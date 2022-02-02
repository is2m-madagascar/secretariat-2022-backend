const Inscription = require("./../Model/Inscriptions");
const Personne = require("./../Model/Personne");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const variables = require("./../Config/Variables");
const QueryRequest = require("./../Utils/QueryRequest");

const createInscription = async (req, res) => {
  const inscription = new Inscription();

  //inscription.matricule = req.body.matricule;
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
  try {
    const etudiant = await Personne.findOne({ matricule: req.body.matricule });

    if (!etudiant) {
      return ResponseHandling.handleError(err, res, "Etudiant not found");
    }

    if (etudiant.statut === "Etudiant") {
      return ResponseHandling.handleError(err, res, "Personne is not student");
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

    const newInsc = await Promise.all(
      inscription.docs.map(async (element) => {
        await element.populate("etudiant");
      })
    );

    return inscription
      ? ResponseHandling.handleResponse(newInsc, res, message)
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
