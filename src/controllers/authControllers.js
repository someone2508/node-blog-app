const util = require('util');
const crypto = require('crypto');
const User = require('../models/User');
const scrypt = util.promisify(crypto.scrypt);
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        if(!req.body.email) return res.json(message.required_field("email"));
        if(!req.body.username) return res.json(message.required_field("username"));
        if(!req.body.password) return res.json(message.required_field("password"));

        if(!_.isEmail(req.body.email)) return res.json(message.invalid_request("email"));
        if(!_.isUserName(req.body.username)) return res.json(message.invalid_request("username"));

        const body = {
            sEmail: req.body.email,
            sUserName: req.body.username
        }

        const query = {
            $or: [{sEmail: body.sEmail}, {sUserName: body.sUserName}]
        }

        const existingUser = await User.findOne(query);

        if(existingUser)
        {
            if(existingUser.sUserName == body.sUserName)
                return res.json(message.custom("username is already taken!"));
            if(existingUser.sEmail == body.sEmail)
                return res.json(message.custom("email is already taken!"));
        }

        const {hashedPassoword, salt} = await encryptPassword(req.body.password);

        body.sPassword = hashedPassoword;
        body.sSalt = salt;

        const newUser = await User.create(body);

        // make the jwt token
        const token = makeToken(newUser._id);

        res.json(message.success("User created", {token}));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("something went wrong!"));
    }
}

const login = async (req, res) => {
    try {
        if(!req.body.email) return res.json(message.required_field("email"));
        if(!req.body.password) return res.json(message.required_field("password"));

        const body = {
            email: req.body.email,
            password: req.body.password
        }

        let user = await User.findOne({sEmail: body.email});

        if(!user)
            return res.json(message.not_found("User with the given email"));

        console.log(user);

        const rs = await checkPassword(req.body.password, user.sSalt, user.sPassword);

        if(!rs)
            return res.json(message.custom("Given password is invalid!"));

        const token = makeToken(user._id);

        res.json(message.success("User logged in", {token}));
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

async function checkPassword(password, salt, hashedPassoword) {
    let userHashedPassword = await scrypt(password, salt, 64);
    userHashedPassword = userHashedPassword.toString('hex');
    return userHashedPassword === hashedPassoword;
}

function makeToken(id) {
    try {
        return jwt.sign({id: id}, process.env.JWT_SECRET);
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function encryptPassword(password) {
    const salt = crypto.randomBytes(8).toString('hex');
    let hashedPassoword = await scrypt(password, salt, 64);
    hashedPassoword = hashedPassoword.toString('hex');
    return {hashedPassoword, salt};
}

module.exports = {
    register,
    login
}