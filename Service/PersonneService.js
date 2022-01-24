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
  /* SearchCriteria */
  const statut = QueryUtils.createStringQuery(req.query.statut);
  const nom = QueryUtils.createStringQuery(req.query.nom);
  const prenoms = QueryUtils.createStringQuery(req.query.prenoms);
  /* End SearchCriteria*/

  const compile = [
    { statut },
    { "nomPrenom.nom": nom },
    { "nomPrenom.prenoms": prenoms },
  ];

  //if no queries, we cannot use $and, so we replace it by {}
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
