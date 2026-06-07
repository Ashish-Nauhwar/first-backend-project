import express from "express"
import mongoose from "mongoose"
import cors from "cors"
//imports cookies-parser middleware which lets your server read and modify cookies sent form the users browser
import cookieParser from "cookie-parser"



const app = express()

 //in an express method used to apply middlware here it tells app to pass every incoming request through the cors config
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// stops users from crashing your server by sending massive json objects
app.use(express.json({limit : "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
//activates the cookie parser mideelware this allows you to securely access a user browser cookies using req.coolies 
app.use(cookieParser())

//route import 

import userRouter from "./routes/user.route.js"

//base route it tells express when request starts with /api/v1/users handover to userRouter

app.use("/api/v1/users" , userRouter)

export { app }