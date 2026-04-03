"use strict";
import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { settingRouter } from "./setting";
import { uploadRouter } from "./upload";
import { galleryRouter } from "./gallery";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/setting", settingRouter);
router.use("/upload", uploadRouter);
router.use("/gallery", galleryRouter);

export { router };
