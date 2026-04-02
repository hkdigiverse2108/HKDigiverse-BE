import Joi from "joi";
import { Document, Schema } from "mongoose";

/* --------------------------------------
              Response
-------------------------------------- */

type ApiResponse<T = any> = {
  status: number;
  message: string;
  data?: T;
  error?: any;
};

export const apiResponse = <T>(status: number, message: string, data: T, error: any): ApiResponse<T> => ({
  status,
  message,
  data,
  error,
});

/* --------------------------------------
              Base
-------------------------------------- */

export interface IBase extends Document {
  companyId: Schema.Types.ObjectId;
  branchId?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* --------------------------------------
              Phone No
-------------------------------------- */

export interface IPhoneNo {
  countryCode: string;
  number: string;
}

/* --------------------------------------
              Validate
-------------------------------------- */

export type IValidate = { error: Joi.ValidationError };

export type IId = { id: Schema.Types.ObjectId };

export type ICommonIdValidate = IValidate & { value: IId };

export type ICommonGetValidate = { page?: number; limit?: number; search?: string; activeFilter?: boolean };

export type IGetCommonValidate = IValidate & { value: ICommonGetValidate };

/* --------------------------------------
              Criteria
-------------------------------------- */

export type IRegexFilter = { $regex?: string; $options?: string };

export type ICriteria<T = {}> = { isDeleted: boolean; isActive?: boolean } & T;

export type ICommonCriteria = ICriteria<{ name?: IRegexFilter; title?: IRegexFilter }>;
