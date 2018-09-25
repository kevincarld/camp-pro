var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/campdb", { useNewUrlParser: true });
var cammentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        username: String
    }
});
module.exports = mongoose.model("Comment", cammentSchema);
