/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Huu Tinh Luu Student ID: 152712196 Date: 5/16/2023
*  Cyclic Link: 
*
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' })
})

app.post("/api/movies", (req, res) => {
    const newMovie = req.body;
    db.addNewMovie(newMovie)
        .then((movie) => {
            res.status(201).json(movie);
        }).catch((err) => {
            res.status(500).json({ error: err });
        })
})

app.get("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    db.getMovieById(id)
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
})

app.put('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const updatedMovie = req.body;
    db.updateMovieById(updatedMovie, id)
        .then(() => {
            res.status(201).json({ message: `Movie ID: ${id} has been updated successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
});

app.delete("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    db.deleteMovieById(id)
        .then(() => {
            res.status(201).json({ message: `Movie ID: ${id} has been deleted successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
})

// ========== PAGE NOT FOUND ==========
app.use((req, res) => {
    res.status(404).sendFile(__dirname + "/404.html");
});

// Tell the app to start listening for requests if the connection with database is successful
db.initialize("mongodb+srv://admin:admin@cluster0.hwvtp1a.mongodb.net/sample_mflix?retryWrites=true&w=majority")
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });