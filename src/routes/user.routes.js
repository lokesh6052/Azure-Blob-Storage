import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { regestierUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  regestierUser
);

export default router;
