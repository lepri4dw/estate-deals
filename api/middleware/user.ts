import {NextFunction, Request, Response} from "express";
import User from "../models/User";
import {RequestWithUser} from "./auth";

const user = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;
  const token = req.get('Authorization');

  if (!token) {
    return next();
  }

  const user = await User.findOne({token});

  if (!user) {
    return next();
  }

  req.user = user;

  return next();
};

export default user;