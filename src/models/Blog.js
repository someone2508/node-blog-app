const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    sTitle: {
        type: String,
        require: [true, "title is a required field!"],
        unqiue: [true, "title should be unqiue!"]
    },
    sContent: {
        type: String,
        require: [true, "content is a required field!"],
        minLength: [100, "content should be atleast of length 100"],
        maxLength: [10000, "content should be no more than length 10000"]
    },
    iUserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'users'
    },
    aVotes: [
        {
            type: {
                type: String,
                enum: ["upvote", "downvote"],
                require: [true, "type in votes is a required field!"]
            },
            iUserId: {
                type: mongoose.Schema.ObjectId,
                ref: 'users'
            }
        }
    ],
    aComments: [
        {
            iComment: {
                type: mongoose.Schema.ObjectId,
                ref: 'comments'
            }
        }
    ],
    aTag: [String]
},
    {
        timeStamps: true
    }
)

module.exports = mongoose.model('Blog', blogSchema);