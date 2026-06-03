import { asyncHandler } from "../utils/asynchandler.js";


//return a 200 response with {message: "ok"}
const registerUser = asyncHandler( async (req , res ) => {
     res.status(200).json({
        message: "ok"
    });    
});

export {registerUser};
