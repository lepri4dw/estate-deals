import express from "express";
import mongoose from "mongoose";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import * as fs from "fs";
import fetch from 'node-fetch';
import path from "path";
import {imagesUpload} from "../multer";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";
import nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import {EMAIL_VERIFICATION} from "../constants";

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

const sendEmail = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: process.env.VERIFY_EMAIL_USER,
      pass: process.env.VERIFY_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Estate Deals" <do-not-reply@estate-deals.kg>`,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

usersRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) => {
  try {
    const token = crypto.randomBytes(4).toString('hex');
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      displayName: req.body.displayName,
      avatar: req.file ? req.file.filename : null,
      verifyEmailToken: token,
    });

    user.generateToken();
    await user.save();

    await sendEmail(
      req.body.email,
      'Подтверджение почты',
     EMAIL_VERIFICATION(token, req.body.displayName),
    )

    return res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return res.status(400).send({error: 'Email не найден!'});
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: 'Неверный email и/или пароль'});
  }

  if (!user.verified) {
    const token = crypto.randomBytes(4).toString('hex');
    user.verifyEmailToken = token;
    await user.save();
    await sendEmail(
      req.body.email,
      'Подтверджение почты',
      EMAIL_VERIFICATION(token, user.displayName),
    );
    return res.status(400).send({
      error: 'Email не подтвержден, на вашу почту было выслано письмо!',
    });
  }

  try {
    user.generateToken();
    await user.save();

    return res.send({message: 'Username and password correct!', user});
  } catch (e) {
    return next(e);
  }

});

const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);
  const fileStream = fs.createWriteStream(filename);
  await new Promise<void>((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function () {
      resolve();
    });
  });
};

usersRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({ error: "Google login error!" });
    }

    const email = payload["email"];
    const googleId = payload["sub"];

    if (!email) {
      return res.status(400).send({error: 'Not enough user data'});
    }

    let user = await User.findOne({email});

    if (!user) {
      const displayName = payload["name"];
      const avatar = payload["picture"];

      const imageRandomId = crypto.randomUUID();

      if (!avatar) {
        return res.status(400).send({error: 'Not enough user data'});
      }
      const imagePath = path.join(config.publicPath, 'images', imageRandomId + '.jpg');

      await downloadFile(avatar, imagePath);
      user = new User({
        email,
        password: crypto.randomUUID(),
        displayName,
        googleId,
        phoneNumber: '',
        avatar: 'images/' + imageRandomId + '.jpg',
      });
    }

    user.generateToken();
    await user.save();

    return res.send({message: 'Login with Google successful!', user});
  } catch (e) {
    return next(e);
  }
});


usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = {message: 'OK'};

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({token});

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

usersRouter.patch('/add-phone', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    if (!req.body.phoneNumber) {
      return res.status(400).send({error: 'Поле телефон является обязательным!'});
    }

    user.phoneNumber = req.body.phoneNumber;

    await user.save();
    return res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    return next(e);
  }
});

usersRouter.post('/verify-email/:token', async (req, res, next) => {
  try {
    const user = await User.findOne({
      verifyEmailToken: req.params.token,
    });

    if (!user) {
      return res
        .status(404)
        .send({ error: 'Неверный токен, вам было выслано новое сообщение!' });
    }

    user.verified = true;
    user.verifyEmailToken = null;
    user.generateToken();
    await user.save();
    return res
      .status(200)
      .send({ message: 'Почта успешно подтверждена!', user });
  } catch (e) {
    return next(e);
  }
});


export default usersRouter;