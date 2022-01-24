const express = require("express");
const dotenv = require("dotenv");
const database = require("./Config/DatabaseConnection");
const QueryUtils = require("./Utils/QueryUtils");
const variablesService = require("./Service/VariablesService");
const personneService = require("./Service/PersonneService");
const inscriptionService = require("./Service/InscriptionService");
const ecolageService = require("./Service/EcolageService");

/* config app*/
const app = express();
dotenv.config();

app.use(QueryUtils.setCorsPolicy);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Connect to mongodb*/
database.connectToMongo();

/* Variables */
app.get("/variables/:variable", variablesService.getVariables);

/* Personne endpoints */
app.post("/personne", personneService.createPersonne);
app.get("/personne/:matricule", personneService.getPersonne);
app.get("/personnes", personneService.paginatePersonnes);
app.put("/personne", personneService.updatePersonne);
app.delete("/personne/:matricule", personneService.deletePersonne);

/* Inscription endpoints*/
app.post("/inscription", inscriptionService.createInscription);
app.get("/inscription/:id", inscriptionService.getInscriptionByID);
app.get("/inscriptions", inscriptionService.paginateInscriptions);
app.delete("/inscription/:id", inscriptionService.deleteInscription);

/* Ecolage endpoints */
app.get("/ecolage/:id", ecolageService.getEcolageByID);
app.get("/ecolages", ecolageService.getEcolages);
app.put("/ecolage/:id", ecolageService.addPayement);

/* Cours endpoints */

/* Facturation endpoints */

/* Embauche */

const port = process.env.APP_PORT || 8010;

app.listen(port, () => {
  console.log(`Application démarré sur le port ${port}`);
});

module.exports = app;
