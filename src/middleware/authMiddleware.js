const jwt = require('jsonwebtoken');
const middleware = {};

middleware.verifyToken = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(!token)
            return res.json(message.unauthorized());

        token = token.replace("Bearer ", "");

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    }
    catch(error) {
        console.log(error);
        res.json(message.error("Something went wrong!"));
    }
}

module.exports = middleware;