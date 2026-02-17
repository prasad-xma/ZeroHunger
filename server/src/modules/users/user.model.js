const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "admin"], default: "user"
    },
    phoneNumber: {
        type: String,
        required: true
    },

    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },

    dateOfBirth: Date, 
    
    gender: { 
        type: String, 
        enum: ["male", "female", "other"] 
    },

    profileImage: String,

    status: { 
        type: String, 
        enum: ["active", "inactive", "banned"], default: "active",

    },

}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);