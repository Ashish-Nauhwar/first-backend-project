import mongoose , {Schema} from "mongoose"

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const VideoSchema = new mongoose.Schema(
    {
     videoFile: {
        type: String,
        required: true

     },
     thumbnail: {
        type: String,
        requied: true,
     },
     tittle: {
        type: String,
        requied: true,
     },
     description: {
        type: String,
        requied: true,
     },
     duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    

    }, {timestamps: true}

)




VideoSchema.plugin(mongooseAggregatePaginate)



export const Video = mongoose.model("Video" , VideoSchema)