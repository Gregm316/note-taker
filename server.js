// require dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Initialize app and create PORT
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET route for index.html sends users to HTML
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// GET route for notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// GET route for api/notes
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// POST route for api/notes takes user input and creates notes
app.post("/api/notes", function(req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteRequest = req.body;
        const newNoteID = notes.length + 1;
        const newNote = {
            id: newNoteID,
            title: noteRequest.title,
            text: noteRequest.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes, null, 2), function(err) {
            if (err) throw err;
        });
    });
});

// DELETE function allows users to delete notes from db
app.delete("/api/notes/:id", function(req, res) {
    const deleteID = req.params.id;
    fs.readFile("./db/db.json", "utf8", function(error, response) {
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if(deleteID <= notes.length) {
            res.json(notes.splice(deleteID-1,1));
            for (let i = 0; i < notes.length; i++) {
                notes[i].id = i+1;
            }
            fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), function(err) {
                if (err) throw err;
            });
        }else {
            res.json(false);
        }
    });
});

// tells user the server running and PORT number
app.listen(PORT, function() {
    console.log(`App is listening on Port ${PORT}`);
})