import mongoose from "mongoose"

const FeatureStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    excerpt: {
        type: String,
        required:[true, "Synopsis is required"]
    },
    image: {
        type: String,
        required:[true, "Please enter Image is required"]
    },
    content:{
        type: String,
        required:[true," Content is required"]
    },
    author:{
        type: String,
        required:[true, "Author is required"]
    },
    video:{
        type: String,    
    },
    key: {
        type: String
    },
    videoKey: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    date:{
        type:Date,
        default: Date.now
    }
})

FeatureStorySchema.index({ date: -1 });

export default mongoose.model("FeatureStory", FeatureStorySchema)