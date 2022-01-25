const Enseignement = require("./../Model/Enseignement");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryUtils = require("./../Utils/QueryUtils");

const createEnseignement = (req, res) => {
  const enseignement = new Enseignement();

  enseignement.anneeScolaire = req.body.anneeScolaire;
  enseignement.niveauEnseigne = req.body.niveauEnseigne;
  enseignement.mention = req.body.mention;
  enseignement.elementConstitutif = req.body.elementConstitutif;
  enseignement.volumeHoraire = req.body.volumeHoraire;
  enseignement.matriculeEnseignant = req.body.matriculeEnseignant;

  console.log("enseignement reçu");
  console.log(enseignement);

  enseignement.save((err) => {
    QueryUtils.handlePostSave(err, res, enseignement);
  });
};

const importEnseignements = (req, res) => {
  const enseignements = req.body;

  console.log("enseignements reçus");
  console.log(enseignements);

  Enseignement.insertMany(enseignements, (err, enseignements) => {
    QueryUtils.handlePostSave(err, res, enseignements);
  });
};

const getEnseignementById = (req, res) => {
  const condition = { _id: req.params.id };

  Enseignement.findOne(condition, (err, enseignement) => {
    QueryUtils.handleCases(
      err,
      enseignement,
      () => {
        return ResponseHandling.handleResponse(
          enseignement,
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

const getEnseignements = (req, res) => {
  const conditions = [];
  req.query.anneeScolaire
    ? conditions.push({ anneeScolaire: { $eq: req.query.anneeScolaire } })
    : "";
  req.query.matriculeEnseignant
    ? conditions.push({ matricule: { $eq: req.query.matriculeEnseignant } })
    : "";
  req.query.niveauEnseigne
    ? conditions.push({ niveauEnseigne: { $eq: req.query.niveauEnseigne } })
    : "";
  req.query.elementConstitutif
    ? conditions.push({
        elementConstitutif: { $eq: req.query.elementConstitutif },
      })
    : "";

  conditions.length === 0 ? conditions.push({}) : "";

  console.log(conditions);

  const searchConditions = {
    $and: conditions,
  };

  return ResponseHandling.handlePagination(
    req,
    res,
    Enseignement,
    searchConditions
  );
};

const updateEnseignement = (req, res) => {
  const condition = { _id: req.body._id };
  const opts = { runValidators: true, new: true };

  Enseignement.findOneAndUpdate(
    condition,
    req.body,
    opts,
    (err, enseignement) => {
      QueryUtils.handleCases(
        err,
        enseignement,
        () => {
          return ResponseHandling.handleResponse(
            enseignement,
            res,
            MessageUtils.PUT_OK
          );
        },
        () => {
          return ResponseHandling.handleError(err, res);
        },
        () => {
          return ResponseHandling.handleNotFound(res);
        }
      );
    }
  );
};

module.exports = {
  createEnseignement,
  importEnseignements,
  getEnseignementById,
  getEnseignements,
  updateEnseignement,
};
