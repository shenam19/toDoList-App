const mongoose = require("mongoose");
const listSchema = new mongoose.Schema({
  name: String,
});
const List = mongoose.model("List", listSchema);
exports = List;
