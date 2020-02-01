// Dependencies
var express = require("express");
var path = require("path");
var fs = require("fs");

// Set up for use of the Express App
var app = express();
var PORT = 8080;

// Data parsing using express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes section-----------------------------------------------

// Notes route using notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// API Notes route
app.get("/api/notes", function (req, res) {
    var jsonContent = getJSONData();
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
    console.log(newNote);
    var jsonContent = getNoteJSON();
    jsonContent.push(newNote);
    fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(jsonContent));
    res.json(jsonContent);
});

// DELETE implementation
app.delete("/api/notes/:id",
    function (req, res) {
        console.log("Deleting id:" + req.params.id);
        let jsonContent = getNoteJSON();
        let updatedJSON = jsonContent.filter(function (definition) {
            return definition.id.toLowerCase() !== req.params.id.toLowerCase();
        });
        fs.writeFileSync(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedJSON));
        res.json(updatedJSON); //sending the updated response back to client app.
    });

function getNoteJSON() {
    let contents = fs.readFileSync(path.join(__dirname, "db", "db.json"));
    return JSON.parse(contents);
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});