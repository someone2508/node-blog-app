const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    sCategoryName: {        // technology
        type: String,
        unqiue: [true, "category name should be unique!"],
        require: [true, "category name is required!"]
    },
    aBlogs: [
        {
            iBlog: {
                type: mongoose.Schema.ObjectId,
                ref: "blogs"
            }
        }
    ]
});

module.exports = mongoose.model("Tag", tagSchema);