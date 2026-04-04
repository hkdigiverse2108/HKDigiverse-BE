import { Router } from "express";
import { policyController } from "../controllers";
import { adminJWT, userJWT } from "../helper";

const router = Router();

router.post("/update", adminJWT, policyController.updatePolicy);
router.get("/get", userJWT, policyController.getPolicy);

export { router as policyRouter };
