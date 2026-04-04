import { HTTP_STATUS } from "../../common";
import { policyModel } from "../../database";
import { getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { apiResponse, IGetPolicyByTypeValidate, IPolicyValidate } from "../../type";
import { getPolicyByTypeSchema, updatePolicySchema } from "../../validation";

export const updatePolicy = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value }: IPolicyValidate = updatePolicySchema.validate(req.body);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0].message, {}, {}));

    let response = await updateData(policyModel, { type: value.type }, value, { upsert: true });
    if (!response) return res.status(HTTP_STATUS.CONFLICT).json(apiResponse(HTTP_STATUS.CONFLICT, `${value.type} policy already exists. Use edit instead.`, {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.updateDataSuccess("Policy"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getPolicy = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value }: IGetPolicyByTypeValidate = getPolicyByTypeSchema.validate(req.query || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    const response = await getFirstMatch(policyModel, { type: value.typeFilter }, {}, {});
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.getDataNotFound("Policy"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Policy"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};
