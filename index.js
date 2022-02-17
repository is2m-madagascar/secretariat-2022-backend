const express = require("express");
const dotenv = require("dotenv");
const database = require("./Config/DatabaseConnection");
const QueryUtils = require("./Utils/QueryUtils");
const variablesService = require("./Service/VariablesService");
const personneService = require("./Service/PersonneService");
const inscriptionService = require("./Service/InscriptionService");
const ecolageService = require("./Service/EcolageService");
const enseignementService = require("./Service/EnseignementService");
const coursService = require("./Service/CoursService");
const factureService = require("./Service/FacturationService");
const niveauService = require("./Service/NiveauService");
const mentionService = require("./Service/MentionService");

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

/* Niveaux endpoint */
app.post("/niveau", niveauService.createNiveau);
app.put("/niveau/:niveau", niveauService.updateMontant);
app.get("/niveaux", niveauService.getNiveaux);

/* Mention endpoint*/
app.post("/mention", mentionService.createMention);
app.put("/mention/:code", mentionService.updateMention);
app.put("/mention/addSpec/:code", mentionService.addSpecToMention);
app.put("/mention/addSpecs/:code", mentionService.addSpecsToMention);
app.get("/mentions", mentionService.getMention);

const port = process.env.PORT || 8080;

app.listen(port, "0.0.0.0", () => {
  console.log(`Application démarré sur le port ${port}`);
});

module.exports = app;
