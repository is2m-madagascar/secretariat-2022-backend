const Inscription = require("./../Model/Inscriptions");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryUtils = require("./../Utils/QueryUtils");

const createInscription = (req, res) => {
  const inscription = new Inscription();

  inscription.matricule = req.body.matricule;
  inscription.dateInscription = new Date();
  inscription.anneeScolaire = req.body.anneeScolaire;
  inscription.niveau = req.body.niveau;
  inscription.mention = req.body.mention;

  console.log("Inscription reçu");
  console.log(inscription);

  inscription.save((err) => {
    if (err) {
      return ResponseHandling.handleError(err, res);
    } else {
      return ResponseHandling.handleResponse(
        inscription,
        res,
        MessageUtils.POST_OK
      );
    }
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
  /* SearchCriteria*/
  const matricule = QueryUtils.createNumberQuery(req.query.matricule, "$eq");
  // anneeScolaire 2020 -> 2020-2021
  const anneeScolaire_annee1 = QueryUtils.createNumberQuery(
    req.query.anneeScolaire,
    "$eq"
  );
  /* End SearchCriteria*/

  const compile = [{ matricule }];

  console.log(compile);

  const searchConditions =
    QueryUtils.compileQuery(compile).length !== 0
      ? {
          $and: QueryUtils.compileQuery(compile),
        }
      : {};

  console.log(searchConditions);

  return ResponseHandling.handlePagination(
    req,
    res,
    Inscription,
    searchConditions
  );
};

module.exports = {
  createInscription,
  getInscriptionByID,
  paginateInscriptions,
};
