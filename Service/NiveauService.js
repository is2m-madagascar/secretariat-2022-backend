const Niveau = require("./../Model/Niveau");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const { handleQueryRequest } = require("../Utils/QueryRequest");

const createNiveau = async (req, res) => {
  const niveau = new Niveau();
  niveau.niveau = req.body.niveau;
  const montantTotal = req.body.montantTotal;
  montantTotal.updated = new Date();
  niveau.montantTotal = montantTotal;

  console.log("Niveau reçu");
  console.log(niveau);

  try {
    await niveau.save();
    return ResponseHandling.handleResponse(niveau, res, MessageUtils.POST_OK);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const updateMontant = async (req, res) => {
  const condition = { niveau: req.params.niveau };
  const opts = { runValidators: true, new: true };
  const niveauToUpdate = await Niveau.findOne(condition);
  montant = req.body;
  
  try {
    montant.updated = new Date();
    niveauToUpdate.montantTotal.push(montant);
    const niveau = await Niveau.findOneAndUpdate(
      condition,
      niveauToUpdate,
      opts
    );
    return niveau
      ? ResponseHandling.handleResponse(niveau, res, MessageUtils.PUT_OK)
      : ResponseHandling.handleError(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const getNiveaux = async (req, res) => {
  const { searchConditions, page, limit } = handleQueryRequest(req);
  console.log(searchConditions);
  try {
    const niveau = await Niveau.paginate(searchConditions, {
      page,
      limit,
      sort: { _id: -1 },
    });
    const message = {
      pagination: {
        totalElements: niveau.total,
        pages: niveau.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };
    return niveau
      ? ResponseHandling.handleResponse(niveau.docs, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

module.exports = { createNiveau, updateMontant, getNiveaux };
