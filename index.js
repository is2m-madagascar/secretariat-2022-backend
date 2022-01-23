const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const personneService = require("./Service/PersonneService");

/* config app*/
const app = express();
dotenv.config();

mongoose.Promise = global.Promise;
// set to false if debug not wanted
mongoose.set("debug", false);

const port = process.env.APP_PORT || 8010;

app.use(function (_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Connect to mongodb*/
const uri = process.env.MONGO_STRING_CONNECTION;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToMongo = (uri, options) => {
  mongoose
    .connect(uri, options)
    .then(() => {
      console.log("Connecté à la base MongoDB");
    })
    .catch((err) => {
      console.error(err);
      setTimeout(() => connectToMongo(uri, options), 5000);
    });
};

connectToMongo(uri, options);

/* Personne endpoints */
app.post("/personne", personneService.createPersonne);
app.get("/personne/:matricule", personneService.getPersonne);
app.get("/personnes", personneService.paginatePersonnes);
app.put("/personne", personneService.updatePersonne);
app.delete("/personne/:matricule", personneService.deletePersonne);

/* Inscription endpoints*/

/* Ecolage endpoints */

/* Cours endpoints */

/* Facturation endpoints */

app.listen(port, () => {
  console.log(`Application démarré sur le port ${port}`);
});

module.exports = app;
