const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Recipe = require("./models/recipe");

mongoose
  .connect(
    "mongodb+srv://abbeyunique:zfR8cYjp3In7sOk9@cluster0-7x9pq.gcp.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Succesfully Connected to MongoDB Atlas!");
  })
  .catch(error => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyparser.json());

app.post("/api/recipes", (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  recipe
    .save()
    .then(() => {
      res.status(201).json({
        message: "Recipe Posted Succesfully"
      });
    })
    .catch(error => {
      res.status(401).json({
        error: error
      });
    });
});

app.get("/api/recipes/:id", (req, res, next) => {
  Recipe.findOne({
    _id: req.params.id
  })
    .then(thing => {
      res.status(200).json(thing);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.put("/api/recipes/:id", (req, res, next) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Recipe.updateOne({ _id: req.params.id }, recipe)
    .then(() => {
      res.status(201).json({
        message: "Recipe updated Succesfully"
      });
    })
    .catch(error => {
      res.status(401).json({
        error: error
      });
    });
});

app.delete("/api/recipes/:id", (req, res, next) => {
  Recipe.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.status(200).json({
        message: "Recipe deleted succesfuly!"
      });
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

app.use("/api/recipes", (req, res, next) => {
  Recipe.find()
    .then(recipes => {
      res.status(200).json(recipes);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
});

module.exports = app;
