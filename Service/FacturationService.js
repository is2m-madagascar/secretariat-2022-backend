const Facturation = require("./../Model/Facture");
const Cours = require("./../Model/Cours");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryRequest = require("./../Utils/QueryRequest");

const getFactures = async (req, res) => {
  const { searchConditions, page, limit } =
    QueryRequest.handleQueryRequest(req);

  try {
    const factures = await Cours.paginate(searchConditions, { page, limit });

    const message = {
      pagination: {
        totalElements: factures.total,
        pages: factures.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return ResponseHandling.handleResponse(factures.docs, res, message);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const getFactureByID = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const facture = await Facturation.findOne(condition).populate("enseignant");

    const respFacture = {};
    respFacture.anneeScolaire = facture.anneeScolaire;
    respFacture.enseignant = facture.enseignant;
    respFacture.mois = facture.mois;
    respFacture.montantTotal = facture.montantTotal;
    respFacture.payee = facture.payee;

    respFacture.cours = [];

    await Promise.all(
      facture.cours.map(async (element) => {
        {
          const cours = await Cours.findOne({ _id: element });
          if (cours) {
            respFacture.cours.push(cours);
          }
          return cours;
        }
      })
    );

    return facture
      ? ResponseHandling.handleResponse(respFacture, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const calculerFacture = (req, res) => {};

const payerFacture = (req, res) => {};

module.exports = { getFactures, getFactureByID, payerFacture, calculerFacture };
