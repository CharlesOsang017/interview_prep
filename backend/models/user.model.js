import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    profileImageUrl: {
        type: String,
        enum: [
            "https://www.vecteezy.com/free-vector/profile-icon", 
            "https://www.vectorstock.com/royalty-free-vector/young-man-profile-vector-14770074", 
            "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/", 
            "https://www.magnific.com/free-photos-vectors/profile"
        ]       
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User