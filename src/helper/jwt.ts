import { Request, Response } from "express";
import { HTTP_STATUS, isValidObjectId, verifyToken } from "../common";
import { userModel } from "../database";
import { apiResponse } from "../type";
import { getFirstMatch } from "./databaseServices";
import { responseMessage } from "./responseMessage";

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
