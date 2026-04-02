import { Router } from "express";
import { userController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/add", adminJWT, userController.addUser);
router.put("/edit", adminJWT, userController.editUser);
router.get("/get", userJWT, userController.getUser);
router.delete("/:id", adminJWT, userController.deleteUser);

export const userRouter = router;
