import express from "express";
import mongoose from "mongoose";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import crypto from "crypto";
import * as fs from "fs";
import fetch from 'node-fetch';
import path from "path";
import {imagesUpload} from "../multer";
import User from "../models/User";
import auth, {RequestWithUser} from "../middleware/auth";

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      displayName: req.body.displayName,
      avatar: req.file ? req.file.filename : null,
    });

    user.generateToken();
    await user.save();
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
    return res.status(400).send({error: 'Username not found'});
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: 'Password is wrong'});
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

    let user = await User.findOne({googleId});

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


export default usersRouter;