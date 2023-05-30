import express from "express";
import {IEstate, PageLimit, SearchParam, SwitchToString} from "../types";
import Estate from "../models/Estate";
import auth, {RequestWithUser} from "../middleware/auth";
import {imagesUpload, UploadedFile} from "../multer";
import {promises as fs} from "fs";
import mongoose, {HydratedDocument} from "mongoose";
import permit from "../middleware/permit";
import {kgsToUsd, usdToKgs} from "../exhange-rates";

const estateRouter = express.Router();

type QueryParams = SwitchToString<
  Pick<IEstate,
    | 'user'
    | 'condition'
    | 'numberOfRooms'
    | 'town'
    | 'dealType'
    | 'estateType'
    > & PageLimit
> // price, floor

estateRouter.get('/', async (req, res, next) => {
  try {
    const { page, limit, ...params }: QueryParams = req.query;
    const l: number = parseInt(limit as string) || 20;
    const p: number = parseInt(page as string) || 1;

    const searchParam = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .reduce<SearchParam>((acc, [key, value]) => {
        acc[key] = value
        return acc;
      }, {});

    console.log(searchParam);

    const totalCount = await Estate.count(searchParam);
    const skip = (p - 1) * l;

    const estates = await Estate.find(searchParam)
      .skip(skip)
      .limit(l);

    return res.send({estates, currentPage: p, totalCount});
  } catch (e) {
    return next(e);
  }
});

estateRouter.get('/:id', async (req, res, next) => {
  try {
    const estate = await Estate.findById(req.params.id).populate('user', 'displayName avatar phoneNumber');

    if (!estate) {
      return res.sendStatus(404);
    }

    return res.send(estate);
  } catch (e) {
    return next(e);
  }
});

estateRouter.post('/', auth, imagesUpload.array('images', 10), async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const files = req.files as UploadedFile[];
    const images = files.map(file => file.filename);

    const estate = await Estate.create({
      user: user._id,
      usdPrice: req.body.usdPrice ? parseInt(req.body.usdPrice) : Math.floor(await kgsToUsd(parseFloat(req.body.kgsPrice))),
      kgsPrice: req.body.kgsPrice ? parseInt(req.body.kgsPrice) : Math.floor(await usdToKgs(parseFloat(req.body.usdPrice))),
      floor: parseInt(req.body.floor) || null,
      numberOfFloors: parseInt(req.body.numberOfFloors) || null,
      numberOfRooms: parseInt(req.body.numberOfRooms) || null,
      square: parseFloat(req.body.square) || null,
      condition: req.body.condition,
      town: req.body.town,
      images,
      district: req.body.district,
      description: req.body.description,
      dealType: req.body.dealType,
      landArea: req.body.landArea,
      estateType: req.body.estateType,
      address: req.body.address,
    });

    return res.send(estate);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

estateRouter.put('/:id', auth, imagesUpload.array('images', 10), async (req, res, next) => {
  try {
    const estate: HydratedDocument<IEstate> | null = await Estate.findById(req.params.id);
    const user = (req as RequestWithUser).user;
    if (!estate) {
      return res.sendStatus(404);
    }

    if (user.role !== 'admin' && !estate.user.equals(user._id)) {
      return res.status(403).send({error: 'Вы не можете изменять не свое обьявление!'});
    }

    const files = req.files as UploadedFile[];
    const images = files.map(file => file.filename);

    estate.usdPrice = req.body.usdPrice ? parseInt(req.body.usdPrice) : Math.floor(await kgsToUsd(parseFloat(req.body.kgsPrice)));
    estate.kgsPrice = req.body.kgsPrice ? parseInt(req.body.kgsPrice) : Math.floor(await usdToKgs(parseFloat(req.body.usdPrice)));
    estate.floor = parseInt(req.body.floor) || req.body.floor;
    estate.numberOfFloors = parseInt(req.body.numberOfFloors) || req.body.numberOfFloors;
    estate.numberOfRooms = parseInt(req.body.numberOfRooms) || req.body.numberOfRooms;
    estate.square = parseFloat(req.body.square) || req.body.square;
    estate.condition = req.body.condition;
    estate.town = req.body.town;
    estate.district = req.body.district;
    estate.description = req.body.description;
    estate.dealType = req.body.dealType;
    estate.landArea = req.body.landArea;
    estate.images = [...estate.images, ...images];

    await estate.save();
    return res.send(estate);
  } catch (e) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }

    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

estateRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const estate: HydratedDocument<IEstate> | null = await Estate.findById(req.params.id);
    if (!estate) {
      return res.sendStatus(404);
    }

    if (user.role !== 'admin' && !estate.user.equals(user._id)) {
      return res.status(403).send({error: 'Вы не можете изменять не свое обьявление!'});
    }

    await Estate.deleteOne({_id: req.params.id});
    return res.send({message: 'Удалено!'});
  } catch (e) {
    return next(e);
  }
});

estateRouter.patch('/:id/togglePublished', auth, permit('admin'), async (req, res, next) => {
  try {
    const estate = await Estate.findById(req.params.id);

    if (!estate) {
      return res.sendStatus(404);
    }

    estate.isPublished = !estate.isPublished;
    await estate.save();
    return res.send({message: 'Обьявление было опубликовано!'});
  } catch (e) {
    return next(e);
  }
});

export default estateRouter;