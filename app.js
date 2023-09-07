const express = require("express");
const app = express();
const path = require("path");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");
// const List = require("./models/lists");
const _ = require("lodash");

mongoose
  .connect(
    "mongodb+srv://admin-sherap:Test%40123@cluster0.duhoexy.mongodb.net/todolistDB"
  )
  .then(() => {
    console.log("Database connected");
  });

const listSchema = new mongoose.Schema({
  name: String,
});
const List = mongoose.model("List", listSchema);
const item1 = new List({
  name: "Study HTML/CSS",
});
const item2 = new List({
  name: "Study BackEnd",
});
const defaultItems = [item1, item2];

const customListSchema = new mongoose.Schema({
  name: String,
  items: [listSchema],
});
const Custom = mongoose.model("Custom", customListSchema);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const day = date.getDate();
  const items = await List.find({});
  if (items.length === 0) {
    List.insertMany(defaultItems);
    res.redirect("/");
  } else {
    res.render("list", { listTitle: "Today", newListItems: items });
  }
});

app.post("/", async (req, res) => {
  const newList = new List({
    name: req.body.newItem,
  });
  if (req.body.list == "Today") {
    await newList.save();
    res.redirect("/");
  } else {
    const foundList = await Custom.findOne({ name: req.body.list });
    foundList.items.push(newList);
    await foundList.save();
    res.redirect("/" + req.body.list);
  }
});

app.get("/:id", async (req, res) => {
  const customListItem = _.capitalize(req.params.id);
  const foundList = await Custom.findOne({ name: customListItem });
  if (!foundList) {
    const newCustom = new Custom({
      name: customListItem,
      items: defaultItems,
    });
    await newCustom.save();
    res.redirect("/" + customListItem);
  } else {
    res.render("list", {
      listTitle: foundList.name,
      newListItems: foundList.items,
    });
  }
});
app.post("/delete", async (req, res) => {
  const listName = req.body.listName;
  if (listName === "Today") {
    const deleteItem = await List.findByIdAndRemove(req.body.checkbox);
    res.redirect("/");
  } else {
    await Custom.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: req.body.checkbox } } }
    );
    res.redirect("/" + listName);
  }
});
app.listen(3000, function () {
  console.log("Server is running at 3000");
});
