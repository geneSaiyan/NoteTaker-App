// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");
var uuidv1 = require('uuid/v1');

// Set up for use of the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Data parsing using express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Use the express.static built-in middleware function in Express.
//To serve static files such as images, CSS files, HTML files, and JavaScript files
app.use(express.static("public"));

// Routes section-----------------------------------------------

// Notes route using notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API Notes route
app.get("/api/notes", function (req, res) {
    var jsonContent = getNoteJSON();
    return res.json(jsonContent);
    // res.sendFile(path.join(__dirname, "db", "db.json"));
});

// Default to the index.html page
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Create New Note a new note using fs and JSON
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    //Creating unique ID using the uuid package
    newNote.id = uuidv1();
    console.log(newNote);
    var noteJson = getNoteJSON();
    noteJson.push(newNote);
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(noteJson));
    res.json(noteJson);
});

// Delete a note based on the id
app.delete("/api/notes/:id",
    function (req, res) {
        var jsonContent = getNoteJSON();
        var updatedJSON = jsonContent.filter(function (data) {
            return data.id != req.params.id;
        });
        fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedJSON));
        res.json(updatedJSON);
    });


function getNoteJSON() {
    var contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    return JSON.parse(contents);
}

// Server starts listening 
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});