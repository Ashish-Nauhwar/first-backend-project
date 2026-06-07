import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

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

   
export default router


