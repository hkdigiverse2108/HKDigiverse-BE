import { Router } from "express";
import { adminJWT, userJWT } from "../helper";
import { galleryController } from "../controllers";

const router = Router();

router.post("/add", adminJWT, galleryController.addGallery);
router.put("/edit", adminJWT, galleryController.editGallery);
router.get("/all", userJWT, galleryController.getAllGallery);
router.delete("/:id", adminJWT, galleryController.deleteGallery);

export { router as galleryRouter };
