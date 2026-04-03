import { HTTP_STATUS, isValidObjectId, resolvePagination, resolveSortAndFilter } from "../../common";
import { galleryModel } from "../../database";
import { countData, createOne, getData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { apiResponse, ICommonIdValidate, IGalleryValidate, IGetCommonValidate } from "../../type";
import { addGallerySchema, deleteGallerySchema, editGallerySchema, getGallerySchema } from "../../validation";

export const addGallery = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IGalleryValidate = addGallerySchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0].message, {}, {}));

    const isExist = await getFirstMatch(galleryModel, { title: value.title, isDeleted: false }, {}, {});
    if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("Gallery Title"), {}, {}));

    value.createdBy = user?._id;
    value.updatedBy = user?._id;

    const response = await createOne(galleryModel, value);
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.addDataError, {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.addDataSuccess("Gallery"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const editGallery = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: IGalleryValidate = editGallerySchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0].message, {}, {}));

    const isExist = await getFirstMatch(galleryModel, { _id: value._id, isDeleted: false }, {}, {});
    if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("Gallery"), {}, {}));

    if (value.title) {
      let isDuplicate = await getFirstMatch(galleryModel, { title: value.title, isDeleted: false, _id: { $ne: value?.galleryId } }, {}, {});
      if (isDuplicate) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("Gallery Title"), {}, {}));
    }

    value.updatedBy = user?._id;

    const response = await updateData(galleryModel, { _id: isValidObjectId(value?.galleryId) }, value, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.updateDataError("Gallery"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.updateDataSuccess("Gallery"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const deleteGallery = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value }: ICommonIdValidate = deleteGallerySchema.validate(req.params);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let isExisting = await getFirstMatch(galleryModel, { _id: value?.id, isDeleted: false }, {}, {});
    if (!isExisting) return res.status(HTTP_STATUS.NOT_FOUND).json(apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Gallery"), {}, {}));

    const response = await updateData(galleryModel, { _id: isValidObjectId(value?.id) }, { isDeleted: true, updatedBy: user?._id }, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.deleteDataError("Gallery"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.deleteDataSuccess("Gallery"), response, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getAllGallery = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value }: IGetCommonValidate = await getGallerySchema.validate(req.query);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    let { criteria, options, page, limit } = resolveSortAndFilter(value, ["title"]);

    const [response, totalData] = await Promise.all([getData(galleryModel, criteria, {}, options), countData(galleryModel, criteria)]);

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Gallery"), { gallery_data: response, totalData, state: resolvePagination(page, limit) }, {}));
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};
