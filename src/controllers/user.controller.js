import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"


//making method to generate access and refresh token and call it multiple times

const generateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken

      await user.save({ validateBeforeSave: false })


      return { accessToken, refreshToken }


   } catch (error) {
      throw new ApiError(400, "something went wrong while generating generateAccessAndRefreshTokens")
   }
}

const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   // validation - not empty
   // check if user already exists: username, email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from response
   // check for user creation
   // return res


   const { fullName, email, username, password } = req.body
   //console.log("email: ", email);


   //four fields in array and loops over them using .some() 
   // if any fields are missing or " " then if goes true and throw error
   if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   //calls mongoose's findoen() method to search for an existing document matching the query criteria 
   // it uses await because database queries are asynchronous
   const existedUser = await User.findOne({
      // uses mongoDB logical or operator to check two parameter already exist?
      $or: [{ username }, { email }]
   })
   console.log(existedUser)
   if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
   }


   //console.log(req.files);
   // to get local file path of the uploaded avatar and ?. for preventing app from crashing
   const avatarLocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;

   let coverImageLocalPath;
   //req.files exists and array is valid and arr length > 0
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      //code accesses the first item and extracts its path
      coverImageLocalPath = req.files.coverImage[0].path
   }


   if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar location is not found")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
   }

   // database record creation 
   const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   //once user creaed then user._id is used to find that user and .select() method used include or exclude the fields 
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
   )

})

const loginUser = asyncHandler(async (req, res) => {
   //req body -> data
   //username or email 
   //find the user 
   //password check
   //access and referesh token
   //send cookie

   console.log("BODY:", req.body);
   const { email, username, password } = req.body
   if (!username && !email) {
      throw new ApiError(400, "username or email is required")
   }



   const user = await User.findOne({
      $or: [{ username }, { email }]
   })
   if (!user) {
      throw new ApiError(404, "User does not exist ")
   }



   const isPasswordValid = await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
      throw new ApiError(401, "you entered password is incorrect")
   }


   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser, accessToken, refreshToken
            },
            "user logged in successfully"
         )
      )

})

const logoutUser = asyncHandler(async (req, res) => {
   User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "user logged out"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request")
   }

   try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
   
      const user = await User.findById(decodedToken?._id)
      if (!user) {
         throw new ApiError(401, "Invalid refresh token")
      }
   
      if (refreshAccessToken !== user?.refreshToken) {
         throw new ApiError(401, "refresh token is expired or used")
      }
   
      const options = {
         httpOnly: true,
         secure: true
      }
   
      const {accessToken , newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
   
      return res
      .status(200)
      .cookie("accessToken" , accessToken, options)
      .cookie("refreshToken" , newRefreshToken , options)
      .json(new ApiResponse(
         200, 
         {accessToken , refreshToken: newRefreshToken},
         "Access token Refreshed"   
      ))
   } catch (error) {
      throw new ApiError(401 , error?.message || "invalid refresh token")
      
   }
})






export { registerUser, loginUser, logoutUser , refreshAccessToken };
