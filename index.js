// use express module
var express = require("express");
var app = express();

// use mongoose
var mongoose = require("mongoose");
// connection address
var uri =
  "mogodb+srv://dbuser:demopass@cluster0-6tein.mongodb.net/sample_mflix";
// make connection
mongoose.connect(uri);
var db = mongoose.connection;
// inform of connection error or connection ok
db.on("error", console.log("Connection error!: "));
db.once("open", function () {
  console.log("Connection fixed!");
});

// bodyparser for reading forms
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// introduce data model schema
const SchemaName = mongoose.model(
  "User",
  {
    username: String,
    password: Number,
    birthday: Date,
  },
  "users"
);

// routes
// GET all, only 20 results shown
app.get("/api/getall", function (req, res) {
  SchemaName.find(
    req.params.id,

    function (err, results) {
      // error handling
      if (err) {
        res.status(500).json("Data search error");
      } else {
        // return results if everything ok
        res.status(200).json(results);
      }
    }
  );
});

// GET id, only 20 results shown
app.get("/api/:id", function (req, res) {
  SchemaName.find(
    {},
    null,
    { limit: 20 },

    function (err, results) {
      // error handling
      if (err) {
        res.status(500).json("Data search error");
      } else {
        // return results if everything ok
        res.status(200).json(results);
      }
    }
  );
});

// POST, add result
app.post("/api/add", function (req, res) {
  res.send("Add this result: " + req.body.username + " " + req.body.birthday);
});

// PUT, update data
app.put("/api/update/:id", function (req, res) {
  res.send("Update TYPEOFRESULT according ID " + req.params.id);
});

// DELETE + error handling(?)
app.delete("/api/delete/:id", function (req, res) {
  // id for deleting
  var id = req.params.id;

  SchemaName.findByIdAndDelete(id, function (err, results) {
    // db error handling
    if (err) {
      console.log(err);
      res.status(500).json("Delete operation not successful");
    }
    // db ok, object not found
    else if (results == null) {
      res.status(200).json("Object not found, cannot be deleted");
    }
    // delete successful
    else {
      console.log(results);
      res.status(200).json(id + " deleted succesfully");
    }
  });
});

// web server with express
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("This app is listening on port %d", PORT);
});
