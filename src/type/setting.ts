import { IBase, IPhoneNo, IValidate } from "./common";

export interface ISocialMediaLink {
  title: string;
  link: string;
  icon: string;
  isActive: boolean;
}

export interface ISetting extends IBase {
  email?: string;
  phoneNo?: IPhoneNo;
  address?: string;
  mapLink?: string;
  logo?: string;
  favicon?: string;
  socialMediaLinks?: ISocialMediaLink[];
}

export type ISettingValidate = IValidate & { value: ISetting };
