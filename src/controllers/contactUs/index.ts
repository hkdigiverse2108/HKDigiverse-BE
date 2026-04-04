import { HTTP_STATUS, isValidObjectId, resolvePagination, resolveSortAndFilter } from "../../common";
import { contactUsModel } from "../../database";
import { countData, createOne, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { ICommonIdValidate, IContactUsValidate, IGetCommonValidate, apiResponse } from "../../type";
import { addContactUsSchema, commonIdSchema, editContactUsSchema, getContactUsSchema } from "../../validation";

export const addContactUs = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IContactUsValidate = addContactUsSchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    value.createdBy = user?._id;
    value.updatedBy = user?._id;

    const response = await createOne(contactUsModel, value);
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.addDataError, {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.addDataSuccess("Contact Us"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const editContactUs = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IContactUsValidate = editContactUsSchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    const isExist = await getFirstMatch(contactUsModel, { _id: isValidObjectId(value.contactUsId), isDeleted: false }, {}, {});
    if (!isExist) return res.status(HTTP_STATUS.NOT_FOUND).json(apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Contact Us"), {}, {}));

    value.updatedBy = user?._id;

    const response = await updateData(contactUsModel, { _id: isValidObjectId(value.contactUsId) }, value, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.updateDataError("Contact Us"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.updateDataSuccess("Contact Us"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const deleteContactUs = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: ICommonIdValidate = commonIdSchema.validate(req.params);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    const isExist = await getFirstMatch(contactUsModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
    if (!isExist) return res.status(HTTP_STATUS.NOT_FOUND).json(apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Contact Us"), {}, {}));

    const response = await deleteData(contactUsModel, { _id: isValidObjectId(value.id) }, { updatedBy: user?._id }, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.deleteDataError("Contact Us"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.deleteDataSuccess("Contact Us"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getAllContactUs = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value }: IGetCommonValidate = getContactUsSchema.validate(req.query);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let { criteria, options, page, limit } = resolveSortAndFilter(value, ["name"]);

    const [response, totalData] = await Promise.all([getData(contactUsModel, criteria, {}, options), countData(contactUsModel, criteria)]);

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Contact Us"), { contactUs_data: response, totalData, state: resolvePagination(page, limit) }, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};
