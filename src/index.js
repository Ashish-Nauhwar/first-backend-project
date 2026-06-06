    //used to load enviroment varibles from a .env file to node process.env
    import dotenv from "dotenv"  

    import connectDB from "./db/index.js"
    import { app } from "./app.js"

   // executes the configuration method for look for .env file
   // in the root directory(./.env) so your app can read private keys
    dotenv.config({
    path: './.env'
    })

    //it checks if a PORT varible is defined in your .env file otherwise defaults 8000
    const PORT = process.env.PORT || 8000


    connectDB()
    // connect to Mongodb
    //promise handling if connectDB ✅ then run the code in .then()
    .then(() => {
    console.log("✅ MongoDB connected successfully!")


   //tells your express app to start listening for incoming HTTP request on specified PORT
    app.listen(PORT , () => {
        console.log(`server is running at port : ${process.env.PORT}`)
    })
    })
    .catch((error) => {
    console.log("MONGODB connection failed", error)
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