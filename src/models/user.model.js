import mongoose , {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowecast: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecast: true,
            trim: true,
            
        },
        fullName: {
            type: String,
            required: true,       
            trim: true,
            index: true,
            
        },
        avatar: {
            type: String, //cloudinary url
            required: true

        },
        coverImage: {
            type: String,

        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "video"
            }
        ],
        password: {
            type: String,
            requird: [true , 'Password is requied']

        },
        refreshToken: {
            type: String,

        },

    },{timestamps:true}
)

// Save karte time password ko incrypt kar do
userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next() ;
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password , this.password)
}

//short-lived access token for user authentication
userSchema.methods.generateAccessToken = function(){
    //sign methos from jsonwebtoken library to create a new token 
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        
         process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//longer-lived refresh token used to request new access tokens wihtout forcing the use to log in again
userSchema.methods.generateRefreshToken = function(){
  //  call jwt.sign() again
    return jwt.sign(
        {
            _id: this.id,
           
        },
        
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema);