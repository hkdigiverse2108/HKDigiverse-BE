import { isValidObjectId } from "mongoose";
import { HTTP_STATUS } from "../../common";
import { userModel } from "../../database";
import { countData, createOne, getData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { apiResponse, ICommonCriteria, ICommonIdValidate, IGetCommonValidate, IUserValidate } from "../../type";
import { addUserSchema, deleteUserSchema, editUserSchema, getUserSchema } from "../../validation";

export const addUser = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IUserValidate = await addUserSchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let isExist = await getFirstMatch(userModel, { email: value.email, isDeleted: false }, {}, {});
    if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("Email"), {}, {}));

    value.createdBy = user?._id;
    value.updatedBy = user?._id;

    let response = await createOne(userModel, value);
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.addDataError, {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.updateDataSuccess("User"), response, {}));
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const editUser = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IUserValidate = await editUserSchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let isExist = await getFirstMatch(userModel, { email: value.email, isDeleted: false }, {}, {});
    if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("Email"), {}, {}));

    value.updatedBy = user?._id;

    const response = await updateData(userModel, { _id: isValidObjectId(value?.userId) }, value, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.updateDataError("User"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.updateDataSuccess("User"), response, {}));
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const deleteUser = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: ICommonIdValidate = await deleteUserSchema.validate(req.params);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let isExisting = await getFirstMatch(userModel, { _id: value?.id, isDeleted: false }, {}, {});
    if (!isExisting) return res.status(HTTP_STATUS.NOT_FOUND).json(apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("User"), {}, {}));

    const response = await updateData(userModel, { _id: isValidObjectId(value?.id) }, { isDeleted: true, updatedBy: user?._id }, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.deleteDataError("User"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.deleteDataSuccess("User"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getUser = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value }: IGetCommonValidate = await getUserSchema.validate(req.query);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let { page, limit, search, activeFilter } = value;
    page = Number(page);
    limit = Number(limit);

    const criteria: ICommonCriteria = {
      isDeleted: false,
      ...(activeFilter !== undefined && { isActive: activeFilter === true }),
      ...(search && { title: { $regex: search, $options: "si" } }),
    };

    const options = { sort: { createdAt: -1 }, skip: (page - 1) * limit, limit };

    const [response, totalData] = await Promise.all([getData(userModel, criteria, {}, options), countData(userModel, criteria)]);
    const totalPages = Math.ceil(totalData / limit) || 1;
    const state = { page, limit, totalPages };

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("User"), { user_data: response, totalData, state }, {}));
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};
