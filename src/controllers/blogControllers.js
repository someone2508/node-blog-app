const Blog = require("../models/Blog");
const Comment = require('../models/Comment');
const Tag = require("../models/Tag");
const {mongodb} = require('../utils/index')

const createBlog = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());

        if(!req.body.title) return res.json(message.required_field("title"));
        if(!req.body.content) return res.json(message.required_field("content"));

        const body = {
            iUserId: req.userId,
            sTitle: req.body.title,
            sContent: req.body.content,
            aTag: req.body.tag ? req.body.tag : []
        }

        const createdBlog = await Blog.create(body);    // [tech, backend]

        for(let tag of createdBlog.aTag) {
            const existingTag = await Tag.findOne({sCategoryName: tag});

            if(existingTag)
            {
                existingTag.aBlogs.push({iBlog: createdBlog._id});
                await existingTag.save();
            }
            else
            {
                await Tag.create({
                    sCategoryName: tag,
                    aBlogs: [{iBlog: createdBlog._id}]
                });
            }
        }

        res.json(message.success("Blog was created"));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

const updateBlog = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());
        if(!req.body.blogId) return res.json(message.required_field("blogId"));
        
        if(!req.body.title && !req.body.content)
            return res.json(message.custom("Nothing provided for updation!"));

        const blog = await Blog.findById(req.body.blogId);

        if(!blog)
            return res.json(message.not_found("Blog with the given blogId"));
        
        if(blog.iUserId.toString("hex") !== req.userId)
            return res.json(message.custom("Invalid updation! Blog does not belong to the logged in user!"));

        if(req.body.title)
            blog.sTitle = req.body.title;
        if(req.body.content)
            blog.sContent = req.body.content;

        await blog.save();

        res.json(message.success("Blog details updated"));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

const deleteBlog = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());

        const id = req.params.id;

        const blog = await Blog.findById(id);
        
        if(!blog)
            return res.json(message.not_found("Blog with the given blogId"));

        if(blog.iUserId.toString("hex") !== req.userId)
            return res.json(message.custom("blog with given blogId does not belong to the logged in user!"));
        
        await Blog.deleteOne({_id: blog._id});

        res.json(message.success("Blog with the given id deleted"));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}


const addVote = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());

        if(!req.params.blogId) return res.json(message.required_field("blogId"));
        if(!req.params.voteType) return res.json(message.required_field("voteType"));
        
        if(req.params.voteType != "upvote" && req.params.voteType != "downvote")
            return res.json(message.invalid_request("Invalid value of voteType"));

        const blogObj = await Blog.findById(req.params.blogId);

        if(!blogObj)
            return res.json(message.not_found("Blog with the given blogId"));

        const isAlreadyVoted = [
            {
                $match: {
                    _id: mongodb.mongify(req.params.blogId)
                }
            },
            {
                $unwind: {
                    path: "$aVotes"
                }
            },
            {
                $match: {
                    "aVotes.iUserId": mongodb.mongify(req.userId)
                }
            }
        ]

        const blog = await Blog.aggregate(isAlreadyVoted);

        console.log(blog);

        if(blog.length > 0)
            return res.json(message.custom("User has already voted on the given blogId!"));
        
        blogObj.aVotes.push({
            type: req.params.voteType,
            iUserId: req.userId
        });

        await blogObj.save();

        res.json(message.success("Vote was added"));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

const addComment = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());

        if(!req.body.blogId) return res.json(message.required_field("blogId"));
        if(!req.body.content) return res.json(message.required_field("content"));
        if(req.body.isParentComment === undefined) return res.json(message.required_field("isParentComment"));

        if(req.body.isParentComment === false && !req.body.parentCommentId)
            return res.json(message.required_field("parentCommentId"));

        let body = {
            iUser: req.userId,
            iBlog: req.body.blogId,
            sContent: req.body.content,
            bIsParentComment: req.body.isParentComment
        }

        if(req.body.isParentComment === false)
            body.iParentCommentId = req.body.parentCommentId

        const blogObj = await Blog.findById(req.body.blogId);

        if(!blogObj) return res.json(message.not_found("Blog with the given blogId"));
        
        
        const createdComment = await Comment.create(body);

        if(req.body.isParentComment === false)
        {
            const parentComent = await Comment.findById(req.body.parentCommentId);
            parentComent.aChildComments.push({
                iChildComment: createdComment._id
            })
            await parentComent.save();
        }

        blogObj.aComments.push({
            iComment: createdComment._id
        });

        await blogObj.save();

        res.json(message.success("Comment added"));

    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

const addReact = async (req, res) => {
    try {
        if(!req.userId) return res.json(message.unauthorized());

        if(!req.body.commentId) return res.json(message.required_field("commentId"));
        if(!req.body.reactType) return res.json(message.required_field("reactType"));

        if(req.body.reactType != "like" && req.body.reactType != "dislike")
            return res.json(message.invalid_request("Invalid value of reactType is identified"));

        const comment = await Comment.findById(req.body.commentId);

        if(!comment)
            return res.json(message.not_found("comment with the given commentId"));
        
        const isAlreadyReacted = [
            {
                $match: {
                    _id: mongodb.mongify(req.body.commentId)
                }
            },
            {
                $unwind: {
                    path: "$aReact"
                }
            },
            {
                $match: {
                    "aReact.iUserId": mongodb.mongify(req.userId)
                }
            }
        ]

        const reactedComment = await Comment.aggregate(isAlreadyReacted);

        if(reactedComment.length > 0)
        {
            return res.json(message.invalid_request("User has already reacted on the comment!"));
        }

        comment.aReact.push({
            iUserId: req.userId,
            type: req.body.reactType
        });

        await comment.save();

        res.json(message.success("Reaction added to the comment"));

    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    addVote,
    addComment,
    addReact
}