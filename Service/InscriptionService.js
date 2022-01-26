const Inscription = require("./../Model/Inscriptions");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryUtils = require("./../Utils/QueryUtils");
const variables = require("./../Config/Variables");

const createInscription = async (req, res) => {
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
    const inscription = await Inscription.findOne(condition);
    return inscription
      ? ResponseHandling.handleResponse(inscription, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const paginateInscriptions = async (req, res) => {
  const conditions = [];

  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;

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

    return inscription
      ? ResponseHandling.handleResponse(inscription, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const deleteInscription = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const inscription = await Inscription.findOneAndDelete(condition);
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
