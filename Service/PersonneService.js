const Personne = require("../Model/Personne");
const ResponseHandling = require("../Utils/ResponseHandling");
const QueryUtils = require("../Utils/QueryUtils");
const MessageUtils = require("../Utils/MessageUtils");

const createPersonne = async (req, res) => {
  const personne = new Personne();

  personne.matricule = req.body.matricule;
  personne.nomPrenom = req.body.nomPrenom;
  personne.statut = req.body.statut;

  console.log("Personne reçu");
  console.log(personne);

  try {
    await personne.save();
    return ResponseHandling.handleResponse(personne, res, MessageUtils.POST_OK);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const getPersonne = async (req, res) => {
  const condition = { matricule: req.params.matricule };

  try {
    const personne = await Personne.findOne(condition);
    return personne
      ? ResponseHandling.handleResponse(personne, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const paginatePersonnes = async (req, res) => {
  const conditions = [];

  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;

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

  try {
    const personnes = await Personne.paginate(searchConditions, {
      page,
      limit,
    });
    const message = {
      pagination: {
        totalElements: personnes.total,
        pages: personnes.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return personnes
      ? ResponseHandling.handleResponse(personnes.docs, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const updatePersonne = async (req, res) => {
  const condition = { matricule: req.body.matricule };
  const opts = { runValidators: true, new: true };

  try {
    const personne = await Personne.findOneAndUpdate(condition, req.body, opts);
    return personne
      ? ResponseHandling.handleResponse(personne, res, MessageUtils.PUT_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const deletePersonne = async (req, res) => {
  const condition = { matricule: req.params.matricule };

  try {
    const personne = await Personne.findOneAndDelete(condition);
    return personne
      ? ResponseHandling.handleResponse(personne, res, MessageUtils.DELETE_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

module.exports = {
  createPersonne,
  getPersonne,
  paginatePersonnes,
  updatePersonne,
  deletePersonne,
};
