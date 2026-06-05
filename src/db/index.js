import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


import dns from "dns";
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])




const connectDB = async () => {
    console.log("MONGODB_URL =", process.env.MONGODB_URL);
    console.log("DB_NAME =", DB_NAME);
    try {
        console.log("MONGODB_URL:", process.env.MONGODB_URL);
        const connectionIntence = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST : ${connectionIntence.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection Error :",  error );
        process.exit(1)
        
    }
}

export default connectDB;