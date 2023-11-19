const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    iBlog: {
        type: mongoose.Schema.ObjectId,
        ref: "blogs",
        require: [true, "blog id is a required field!"]
    },
    iUser: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        require: [true, "user id is a required field!"]
    },
    sContent: {
        type: String,
        require: [true, "content is a required field in comment!"],
        minLength: [1, "content should be atleast 1 length"],
        maxLength: [500, "content should not be more then 500 length"]
    },
    aReact: [
        {
            iUserId: {
                type: mongoose.Schema.ObjectId,
                ref: "users",
                unqiue: true
            },
            type: {
                type: String,
                enum: ["like", "dislike"]
            }
        }
    ],
    bIsParentComment: {
        type: Boolean,
        default: true
    },
    iParentCommentId: {
        type: mongoose.Schema.ObjectId,
        ref: "comments"
    },
    aChildComments: [
        {
            iChildComment: {
                type: mongoose.Schema.ObjectId,
                ref: "comments"
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);