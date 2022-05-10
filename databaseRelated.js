// use express module
var express = require("express");
var app = express();

// bodyparser for reading forms
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// use mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// introduce data model schema
var AirBnBSchema = new Schema({
  id: { type: Number, required: true, minlength: 8 },
  name: { type: String, required: true, minlength: 4 },
  description: { type: String },
  room_type: { type: String },
  bed_type: { type: String },
  minimum_nights: { type: Number, min: [1, "Value cannot be less than 1"] },
  maximum_nights: { type: Number, max: [365, "365 is the maximum"] },
});

// Schema methods go here before mongoose.model. this method tells a bit about the place
AirBnBSchema.methods.tellAbout = function () {
  var about =
    "This place is called " +
    this.name +
    " and description tells the following. " +
    this.description +
    ".";
  console.log(about);
};

const AirBnB = mongoose.model("AirBnB", AirBnBSchema);

// connection address
var uri =
  "mongodb+srv://piiajii:Kirpuke22@cluster0.yusjo.mongodb.net/sample_airbnb";
// make connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// new object
var newPlaceToStay = new AirBnB({
  id: 12345678,
  name: "The shack",
  description: "Old house in poor condition",
  room_type: "Living room",
  bed_type: "Sofa",
  minimum_nights: 1,
  maximum_nights: 3,
});

newPlaceToStay.tellAbout();

// insert object to db and validate
newPlaceToStay
  .save()
  .then(() => console.log("New place is saved"))
  .catch((err) => {
    console.log("Validator error: ");
    console.log(err.message);
  });

// get all objects from db
AirBnB.find({}, function (err, results) {
  console.log(results);
});

// find object 'query' and update with 'newData'
var query = { name: "Haunted place" };
var newData = {
  name: "An old castle full of ghosts",
  minimum_nights: 2,
  maximum_nights: 15,
};

// if value is found the new value is returned, otherwise the old value is returned
var options = { new: true };

// function for searching and updating
AirBnB.findOneAndUpdate(query, newData, options, function (err, results) {
  console.log(results);
});

// print out all airbnbs
app.get("/api/places", function (req, res) {
  AirBnB.find({}, null, { limit: 20 }, function (err, results) {
    if (err) {
      res.json("Error while trying to fetch from database", 500);
    } else {
      res.status(200).json(results);
    }
  });
});

// Add a place
app.post("/api/add", function (req, res) {
  res.send(
    "Add an AirBnB: " + req.body.id + req.body.name + req.body.description
  );
});

// update data using id
app.put("/api/update/:id", function (req, res) {
  var id = req.params.id;
  AirBnB.findByIdAndUpdate(id, function (err, results) {
    // db error handling
    if (err) {
      console.log(err);
      res.status(500).json("Update operation not successful");
    }
    // db ok, object not found
    else if (results == null) {
      res.status(200).json("Object not found, cannot be updated");
    } // delete successful
    else {
      res.status(200).json("Updated " + id + " " + results.name);
    }
  });
});

// Delete a place using id
app.delete("/api/delete/:id", function (req, res) {
  var id = req.params.id;
  AirBnB.findByIdAndDelete(id, function (err, results) {
    // db error handling
    if (err) {
      console.log(err);
      res.status(500).json("Delete operation not successful");
    }
    // db ok, object not found
    else if (results == null) {
      res.status(200).json("Object not found, cannot be deleted");
    } // delete successful
    else {
      res.status(200).json("Deleted " + id + " " + results.name);
    }
  });
});

// create server using express
app.listen(8081, function () {
  console.log("Listening to port 8081");
});
