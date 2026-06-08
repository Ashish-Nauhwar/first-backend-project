import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router()

router.route("/register").post(
    // .fields() is used when you expect multiple, separate files from diffrent form input fields simultaneously
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
     registerUser //first multer process karega then express registerUser ko pass kardega to save the textual body 
    )

router.route("/login").post(loginUser) 

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
    
export default router


