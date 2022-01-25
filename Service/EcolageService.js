const Inscription = require("./../Model/Inscriptions");
const QueryUtils = require("./../Utils/QueryUtils");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");

const payerEcolage = (req, res) => {
  const condition = { _id: req.params.id };
  const opts = { runValidators: true, new: true };

  Inscription.findOne(condition, (err, inscription) => {
    QueryUtils.handleCases(
      err,
      inscription,
      () => {
        const temp = inscription.ecolage.paiementsEffectues;
        temp.push({
          montant: req.body.montant,
          datePaiement: new Date(),
          motif: req.body.motif,
        });
        inscription.ecolage.paiementsEffectues.push(temp);
        Inscription.findOneAndUpdate(
          condition,
          inscription,
          opts,
          (err, inscription) => {
            QueryUtils.handleCases(
              err,
              inscription,
              () => {
                ResponseHandling.handleResponse(
                  inscription,
                  res,
                  MessageUtils.PUT_OK
                );
              },
              () => {
                ResponseHandling.handleError(err, res);
              },
              () => {
                ResponseHandling.handleNotFound(res);
              }
            );
          }
        );
      },
      () => {
        ResponseHandling.handleError(err, res);
      },
      () => {
        ResponseHandling.handleNotFound(res);
      }
    );
  });
};

module.exports = { payerEcolage };
