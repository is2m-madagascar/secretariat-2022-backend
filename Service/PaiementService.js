const Inscription = require("../Model/Inscriptions");
const Paiement = require("./../Model/Paiement");
const ResponseHandling = require("../Utils/ResponseHandling");
const MessageUtils = require("../Utils/MessageUtils");
const { handleQueryRequest } = require("./../Utils/QueryRequest");

const effectuerPaiement = async (req, res) => {
  const condition = { _id: req.params.idInscription };
  const populate = ["etudiant", "niveau", "mention"];
  const populate_v2 = populate.concat(["paiements"]);
  const opts = { runValidators: true, new: true, populate };

  const paiement = new Paiement();

  try {
    const inscription = await Inscription.findOne(condition, null, {});

    paiement.personne = inscription.etudiant._id;
    paiement.montant = req.body.montant;
    paiement.motif = req.body.motif;
    paiement.inscription = inscription._id;

    const savedPaiement = await paiement.save();

    console.log(inscription);

    const tempInsc = await Inscription.findOne(
      { _id: req.params.idInscription },
      null,
      { populate_v2 }
    );

    tempInsc.paiements.push(savedPaiement);

    const inscriptionModifie = await Inscription.findOneAndUpdate(
      condition,
      tempInsc,
      opts
    );

    return inscriptionModifie
      ? ResponseHandling.handleResponse(
          inscriptionModifie,
          res,
          MessageUtils.PUT_OK
        )
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const paginatePaiements = async (req, res) => {
  const { searchConditions, page, limit } = handleQueryRequest(req);

  try {
    const paiements = await Paiement.paginate(searchConditions, {
      limit,
      page,
      populate: ["personne", "inscription"],
    });

    const message = {
      pagination: {
        totalElements: paiements.total,
        pages: paiements.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return paiements
      ? ResponseHandling.handleResponse(paiements.docs, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

module.exports = { effectuerPaiement, paginatePaiements };
