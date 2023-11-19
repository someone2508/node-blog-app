const mongoose = require('mongoose');

function MongoClient() {

}

MongoClient.prototype.initialize = function() {
    mongoose.connect(process.env.DB_LOCAL)
        .then(() => console.log("DB connected!"))
        .catch((error) => {
            console.log("Something went wrong in connecting DB!");
            console.log(error)
        });
}

MongoClient.prototype.mongify = function(id) {
    return new mongoose.Types.ObjectId(id);
}

module.exports = new MongoClient();