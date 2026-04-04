"use strict";
import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { settingRouter } from "./setting";
import { uploadRouter } from "./upload";
import { galleryRouter } from "./gallery";
import { contactUsRouter } from "./contactUs";
import { policyRouter } from "./policy";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/setting", settingRouter);
router.use("/upload", uploadRouter);
router.use("/gallery", galleryRouter);
router.use("/contact-us", contactUsRouter);
router.use("/policy", policyRouter);

export { router };
