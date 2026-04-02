import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { userModel } from "../database";
import { responseMessage } from "./responseMessage";
import { HTTP_STATUS, isValidObjectId } from "../common";
import { getFirstMatch } from "./databaseServices";
import { apiResponse } from "../type";

const jwt_token_secret = process.env.JWT_TOKEN_SECRET;

const verifyToken = (authorization?: string) => {
  if (!authorization) return null;
  const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
  return jwt.verify(token, jwt_token_secret) as any;
};

export const adminJWT = async (req: Request, res: Response, next) => {
  let { authorization } = req.headers,
    result: any;
  try {
    if (!authorization) return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.tokenNotFound, {}, {}));

    let isVerifyToken = verifyToken(authorization);
    result = await getFirstMatch(userModel, { _id: isValidObjectId(isVerifyToken._id), isDeleted: false }, {}, {});

    if (result?.isActive === false) return res.status(HTTP_STATUS.FORBIDDEN).json(apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}));

    req.headers.user = result;
    return next();
  } catch (error) {
    console.error(error);
    if (error.message === "invalid signature") return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
    else if (error.name === "TokenExpiredError") return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire, {}, {}));
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
  }
};

export const userJWT = async (req: Request, res: Response, next) => {
  let { authorization } = req.headers,
    result: any;
  try {
    if (!authorization) return next();

    let isVerifyToken = verifyToken(authorization);
    result = await getFirstMatch(userModel, { _id: isValidObjectId(isVerifyToken._id), isDeleted: false }, {}, {});

    if (result?.isActive === false) return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.accountBlock, {}, {}));

    req.headers.user = result;
    return next();
  } catch (error) {
    console.error(error);
    if (error.message === "invalid signature") return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
    else if (error.name === "TokenExpiredError") return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire, {}, {}));
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
  }
};
