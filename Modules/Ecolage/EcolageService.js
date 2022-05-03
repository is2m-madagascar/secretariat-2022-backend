const Inscription = require("./../Model/Inscriptions");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");

const payerEcolage = async (req, res) => {
  const condition = { _id: req.params.id };
  const opts = { runValidators: true, new: true };

  try {
    const inscription = await Inscription.findOne(condition);

    inscription.ecolage.paiementsEffectues.push({
      montant: req.body.montant,
      datePaiement: new Date(),
      motif: req.body.motif,
    });

    const inscriptionModifie = await Inscription.findOneAndUpdate(
      condition,
      inscription,
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

module.exports = { payerEcolage };
