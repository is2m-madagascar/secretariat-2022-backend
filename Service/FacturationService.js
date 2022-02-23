const Facturation = require("./../Model/Facture");
const Cours = require("./../Model/Cours");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryRequest = require("./../Utils/QueryRequest");
const Facture = require("./../Model/Facture");

const getFactures = async (req, res) => {
  const { searchConditions, page, limit } =
    QueryRequest.handleQueryRequest(req);

  try {
    const factures = await Facturation.paginate(searchConditions, {
      page,
      limit,
      sort: { _id: -1 },
      populate: ["enseignant", "cours"],
    });

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

const calculerFacture = async (req, res) => {
  const condition = { _id: req.params.id };

  //niveauEns = Master *2
  //Grade ens = samihafa

  try {
    //Chercher la facture à calculer
    const facture = await Facture.findOne(condition, null, {
      populate: ["cours", "enseignant"],
    });

    //Si aucune facture ne correspond
    if (!facture) {
      return ResponseHandling.handleNotFound(res);
    }

    const volumeHoraire = [];
    console.log(facture);

    await Promise.all(
      /*facture.cours.map(async (element) => {
        const cours = await Cours.findOne({ _id: element._id }).populate(
          "enseignement"
        );

        const niveau = cours.enseignement.niveauEnseigne;

        const prix = volumeHoraire.push({
          days: element.volumeConsomme.days || 0,
          hours: element.volumeConsomme.hours || 0,
          minutes: element.volumeConsomme.minutes || 0,
          prix: 0,
          niveau,
        });
      })*/

    );

    //TODO calcul
    console.log(volumeHoraire);

    /*const updatedFacture = Facture.findOneAndUpdate(
      condition,
      { montantTotal },
      opts
    );*/

    return ResponseHandling.handleResponse(facture, res, MessageUtils.PUT_OK);
  } catch (e) {
    ResponseHandling.handleError(e, res);
  }
};

const payerFacture = async (req, res) => {
  const condition = { _id: req.params.id };
  const opts = { runValidators: true, new: true, populate: "cours" };

  console.log(condition);

  try {
    const facture = await Facturation.findOneAndUpdate(
      condition,
      { payee: true },
      opts
    );

    //const updatedFacture = await Facturation.findOne(condition);
    return facture
      ? ResponseHandling.handleResponse(facture, res, MessageUtils.PUT_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    ResponseHandling.handleError(e, res);
  }
};

module.exports = { getFactures, getFactureByID, payerFacture, calculerFacture };
