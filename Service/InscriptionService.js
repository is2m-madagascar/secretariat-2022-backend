const Inscription = require("./../Model/Inscriptions");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryUtils = require("./../Utils/QueryUtils");
const variables = require("./../Config/Variables");

const createInscription = (req, res) => {
  const inscription = new Inscription();

  inscription.matricule = req.body.matricule;
  inscription.dateInscription = new Date();
  inscription.anneeScolaire = req.body.anneeScolaire;
  inscription.niveau = req.body.niveau;
  inscription.mention = req.body.mention;
  inscription.ecolage = {
    montantTotal: {
      fraisInsc: variables.fraisInscription,
      fraisFormation: variables.fraisScolarite[inscription.niveau],
    },
    paiementsEffectues: [],
  };

  console.log("Inscription reçu");
  console.log(inscription);

  inscription.save((err) => {
    QueryUtils.handlePostSave(err, res, inscription);
  });
};

const getInscriptionByID = (req, res) => {
  const condition = { _id: req.params.id };

  Inscription.findOne(condition, (err, inscription) => {
    QueryUtils.handleCases(
      err,
      inscription,
      () => {
        return ResponseHandling.handleResponse(
          inscription,
          res,
          MessageUtils.GET_OK
        );
      },
      () => {
        return ResponseHandling.handleError(err, res);
      },
      () => {
        return ResponseHandling.handleNotFound(res);
      }
    );
  });
};

const paginateInscriptions = (req, res) => {
  const conditions = [];
  req.query.matricule
    ? conditions.push({ matricule: { $eq: req.query.matricule } })
    : "";
  req.query.anneeScolaire
    ? conditions.push({ anneeScolaire: { $eq: req.query.anneeScolaire } })
    : "";
  req.query.niveau
    ? conditions.push({ niveau: { $eq: req.query.niveau } })
    : "";
  req.query.mention
    ? conditions.push({ "mention.code": { $eq: req.query.mention } })
    : "";

  conditions.length === 0 ? conditions.push({}) : "";

  console.log(conditions);

  const searchConditions = {
    $and: conditions,
  };

  return ResponseHandling.handlePagination(
    req,
    res,
    Inscription,
    searchConditions
  );
};

const deleteInscription = (req, res) => {
  const condition = { _id: req.params.id };
  Inscription.findOneAndDelete(condition, (err, inscription) => {
    QueryUtils.handleCases(
      err,
      inscription,
      () => {
        return ResponseHandling.handleResponse(
          inscription,
          res,
          MessageUtils.DELETE_OK
        );
      },
      () => {
        return ResponseHandling.handleError(err, res);
      },
      () => {
        return ResponseHandling.handleNotFound(res);
      }
    );
  });
};

module.exports = {
  createInscription,
  getInscriptionByID,
  paginateInscriptions,
  deleteInscription,
};
