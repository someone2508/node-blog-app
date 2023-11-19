const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    sUserName: {
        type: String,
        unqiue: [true, "username should be unique!"],
        require: [true, "username is a required field!"]
    },
    sEmail: {
        type: String,
        unqiue: [true, "email should be unqiue!"],
        require: [true, "email is a required field!"]
    },
    sPassword: {
        type: String,
        require: [true, "password is a required field!"]
    },
    oName: {
        sFirstName: String,
        sLastName: String
    },
    aBlogs: [
        {
            iBlogId: {
                type: mongoose.Schema.ObjectId,
                ref: 'blogs',
                require: [true, "blogId is a required field!"]
            }
        }
    ],
    sSalt: {
        type: String,
        require: [true, "salt is a required field!"]
    },
    sProfilePicUrl: {
        type: String,
        default: ""
    },
    bIsUserVerified: {
        type: Boolean,
        default: false
    },
    bIsEmailVerified: {
        type: Boolean,
        default: false
    },
    sResetPasswordToken: String,
    sResetPasswordExpires: String,
    sVerifyEmailToken: String,
    sVerifyEmailTokenExpires: String
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);