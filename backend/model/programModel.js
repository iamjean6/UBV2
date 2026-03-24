import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter program name']
    },
    synopsis: {
        type: String,
        required: [true, 'Please enter program synopsis']
    },
    image: {
        type: String,
        required: [true, 'Please enter program image']
    },
    images: {
        type: [String],
        required: [true, 'Please enter program images']
    },
    key: {
        type: String,
        required: [true, 'Please enter program image key']
    }
})
export default mongoose.model('Program', Schema);
