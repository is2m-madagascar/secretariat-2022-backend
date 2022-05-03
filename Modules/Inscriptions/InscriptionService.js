const Inscription = require("./Inscriptions");
const Personne = require("../Personnes/Personne");
const ResponseHandling = require("../../Utils/ResponseHandling");
const MessageUtils = require("../../Utils/MessageUtils");
const QueryRequest = require("../../Utils/QueryRequest");

const createInscription = async (req, res) => {
  const inscription = new Inscription();

  //inscription.matricule = req.body.matricule;
  inscription.etudiant = req.body.etudiant_id;
  inscription.dateInscription = new Date();
  inscription.anneeScolaire = req.body.anneeScolaire;
  inscription.niveau = req.body.niveau;
  inscription.mention = req.body.mention;
  /*inscription.ecolage = {
    montantTotal: {
      fraisInsc: variables.fraisInscription,
      fraisFormation: variables.fraisScolarite[inscription.niveau],
    },
    paiementsEffectues: [],
  };*/
  console.log("Inscription reçu");
  console.log(inscription);
  try {
    const etudiant = await Personne.findOne({ _id: req.body.etudiant_id });

    if (!etudiant) {
      return ResponseHandling.handleError(
        "Etudiant not found",
        res,
        "Etudiant not found"
      );
    }

    if (etudiant.statut !== "Etudiant") {
      return ResponseHandling.handleError(
        "Not a student",
        res,
        "Personne is not student"
      );
    }

    inscription.etudiant = etudiant._id;

    await inscription.save();

    const inscriptionSaved = await Inscription.findOne(inscription).populate(
      "etudiant"
    );

    return ResponseHandling.handleResponse(
      inscriptionSaved,
      res,
      MessageUtils.POST_OK
    );
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const getInscriptionByID = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const inscription = await Inscription.findOne(condition).populate(
      "etudiant"
    );
    return inscription
      ? ResponseHandling.handleResponse(inscription, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const paginateInscriptions = async (req, res) => {
  const { searchConditions, page, limit } =
    QueryRequest.handleQueryRequest(req);

  try {
    const inscription = await Inscription.paginate(searchConditions, {
      limit,
      page,
      populate: "etudiant",
      sort: { _id: -1 },
    });

    const message = {
      pagination: {
        totalElements: inscription.total,
        pages: inscription.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return inscription
      ? ResponseHandling.handleResponse(inscription.docs, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const deleteInscription = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const inscription = await Inscription.findOneAndDelete(condition).populate(
      "etudiant"
    );
    return inscription
      ? ResponseHandling.handleResponse(
          inscription,
          res,
          MessageUtils.DELETE_OK
        )
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

module.exports = {
  createInscription,
  getInscriptionByID,
  paginateInscriptions,
  deleteInscription,
};
