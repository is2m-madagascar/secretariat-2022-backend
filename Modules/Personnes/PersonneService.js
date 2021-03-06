const Personne = require("./Personne");
const ResponseHandling = require("../../Utils/ResponseHandling");
const MessageUtils = require("../../Utils/MessageUtils");
const { handleQueryRequest } = require("../../Utils/QueryRequest");

const createPersonne = async (req, res) => {
  const personne = new Personne();
  personne.matricule = req.body.matricule;
  personne.nomPrenom = req.body.nomPrenom;
  personne.statut = req.body.statut;
  personne.contacts = req.body.contacts;
  personne.adress = req.body.adress;
  personne.grade = req.body.grade || null;
  personne.parents = req.body.parents;
  personne.diplome = req.body.diplome;
  personne.sexeM = req.body.sexeM;
  personne.photoAdress = req.body.photoAdress || null;
  console.log("Personne reçu");
  console.log(personne);
  try {
    await personne.save();
    return ResponseHandling.handleResponse(personne, res, MessageUtils.POST_OK);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
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
  const { searchConditions, page, limit } = handleQueryRequest(req);
  console.log(searchConditions);
  try {
    const personnes = await Personne.paginate(searchConditions, {
      page,
      limit,
      sort: { _id: -1 },
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
  const personneToUpdate = req.body;
  personneToUpdate.lastUpdated = new Date();
  try {
    const personne = await Personne.findOneAndUpdate(
      condition,
      personneToUpdate,
      opts
    );
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
