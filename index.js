const express = require("express");
//const dotenv = require("dotenv");
const database = require("./Config/DatabaseConnection");
const QueryUtils = require("./Utils/QueryUtils");
const variablesService = require("./Service/VariablesService");
const personneService = require("./Service/PersonneService");
const inscriptionService = require("./Service/InscriptionService");
const ecolageService = require("./Service/EcolageService");
const enseignementService = require("./Service/EnseignementService");
const coursService = require("./Service/CoursService");
const factureService = require("./Service/FacturationService");

/* config app*/
const app = express();
//dotenv.config();

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
app.put("/inscription/payerEcolage/:id", ecolageService.payerEcolage);

/* Enseignement endpoints*/
app.post("/enseignement", enseignementService.createEnseignement);
app.post("/enseignements", enseignementService.importEnseignements);
app.get("/enseignement/:id", enseignementService.getEnseignementById);
app.get("/enseignements", enseignementService.getEnseignements);
app.put("/enseignement", enseignementService.updateEnseignement);

/* Cours endpoints */
app.post("/cours", coursService.ouvrirCours);
app.put("/cours/:id", coursService.fermerCours);
app.get("/cours/:id", coursService.getCoursById);
app.get("/cours", coursService.getCours);

/* Facturation endpoints */
app.get("/facture/:id", factureService.getFactureByID);
app.get("/factures", factureService.getFactures);
app.put("/facture/calculer/:id", factureService.calculerFacture);
app.put("/facture/payer/:id", factureService.payerFacture);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Application démarré sur le port ${port}`);
});

module.exports = app;
