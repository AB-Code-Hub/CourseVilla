const mongoose  = require('mongoose')

const userSchema =  new mongoose.Schema({
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    iosCode: {
        type: Number,
        default: null,
    },
    countryCode: {
        type: Number,
        default: null,
    },
    moblie: {
        type: Number,
        default: null
    },
    profilePic: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "user",
    },

    otp:{
        type: String,
        default: null,
    },

    emailVerified: {
        type: Boolean,
        default: false,
    }


},{timestamps: true})

module.exports = mongoose.model("User", userSchema)