const Personne = require("../Model/Personne");
const ResponseHandling = require("../Utils/ResponseHandling");
const QueryUtils = require("../Utils/QueryUtils");
const MessageUtils = require("../Utils/MessageUtils");

const createPersonne = (req, res) => {
  const personne = new Personne();

  personne.matricule = req.body.matricule;
  personne.nomPrenom = req.body.nomPrenom;
  personne.statut = req.body.statut;

  console.log("Personne reçu");
  console.log(personne);

  personne.save((err) => {
    if (err) {
      return ResponseHandling.handleError(err, res);
    } else {
      return ResponseHandling.handleResponse(
        personne,
        res,
        MessageUtils.POST_OK
      );
    }
  });
};

const getPersonne = (req, res) => {
  const condition = { matricule: req.params.matricule };

  Personne.findOne(condition, (err, personne) => {
    QueryUtils.handleCases(
      err,
      personne,
      () => {
        return ResponseHandling.handleResponse(
          personne,
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

const paginatePersonnes = (req, res) => {

  const conditions = [];
  req.query.statut
    ? conditions.push({ statut: QueryUtils.regexp(req.query.statut) })
    : "";
  req.query.nom
    ? conditions.push({ "nomPrenom.nom": QueryUtils.regexp(req.query.nom) })
    : "";
  req.query.prenoms
    ? conditions.push({
        "nomPrenom.prenoms": QueryUtils.regexp(req.query.prenoms),
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
    Personne,
    searchConditions
  );
};

const updatePersonne = (req, res) => {
  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  Personne.findOneAndUpdate(condition, req.body, opts, (err, personne) => {
    QueryUtils.handleCases(
      err,
      personne,
      () => {
        return ResponseHandling.handleResponse(
          personne,
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
  });
};

const deletePersonne = (req, res) => {
  const condition = { matricule: req.params.matricule };

  Personne.findOneAndDelete(condition, (err, personne) => {
    QueryUtils.handleCases(
      err,
      personne,
      () => {
        return ResponseHandling.handleResponse(
          personne,
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
  createPersonne,
  getPersonne,
  paginatePersonnes,
  updatePersonne,
  deletePersonne,
};
