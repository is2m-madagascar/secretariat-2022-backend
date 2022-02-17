const Inscription = require("./../Model/Inscriptions");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryRequest = require("./../Utils/QueryRequest");

const populate = ["etudiant", "niveau", "mention", "paiements"];

const createInscription = async (req, res) => {
  const inscription = new Inscription();

  inscription.anneeScolaire = req.body.anneeScolaire;

  /* ObjectID*/
  inscription.niveau = req.body.niveau;
  inscription.mention = req.body.mention;
  inscription.etudiant = req.body.etudiant;
  inscription.promotion = req.body.promotion;

  inscription.codeSpecialisation = req.body.codeSpecialisation;

  console.log("Inscription reçu");
  console.log(inscription);

  try {
    await inscription.save();
    return ResponseHandling.handleResponse(
      inscription,
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
    const inscription = await Inscription.findOne(condition, null, {
      populate,
    });
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
      populate,
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
    return ResponseHandling.handleError(e, res);
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
