import express from "express"
import dotenv from "dotenv";


import connectDB from "./db/index.js";



dotenv.config({
    path: './env'

})

//initilize  express
const app = express()
const PORT = process.env.PORT || 8000;

connectDB()
// connect to Mongodb
.then(() => {
    console.log("✅ MongoDB connected successfully!")

    // 4. Start the Express server ONLY after the database connects
    app.listen(PORT , () => {
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGODB connection failed" , error);
}
)
















/*
import express from "express";
const app = express();

(async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error" , (error) => {
            console.log("Error: " , error );
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on the ${process.env.PORT}`);

        })


    } catch (error) {
        console.error("Error : " , error)
        throw error
    }

})()

*/