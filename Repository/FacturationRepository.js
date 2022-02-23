const Facture = require("./../Model/Facture");
const Cours = require("./../Model/Cours");
const ResponseHandling = require("./../Utils/ResponseHandling");

/**
 * Insérer un cours dans une facture puis calculer le montant total de la facture
 * @param {*} newCours
 * @param {*} req
 * @returns
 */
const createFactureAndCours = async (newCours, req) => {
  const anneeScolaire = req.body.anneeScolaire;
  const enseignant = newCours.enseignant;
  const mois = new Date().getMonth() + 1;
  const payee = false;

  var facture = await Facture.findOne({
    anneeScolaire,
    enseignant,
    mois,
    payee,
  });

  if (!facture) {
    facture = new Facture();
    facture.anneeScolaire = anneeScolaire;
    facture.enseignant = enseignant;
    facture.mois = mois;
    facture.payee = false;
    facture.cours = [newCours._id];
    await facture.save();
    console.log("facture inséré");
  } else {
    facture.cours.push(newCours._id);
    const opts = { runValidators: true, new: true };
    await Facture.findOneAndUpdate({ _id: facture._id }, facture, opts);
  }

  newCours.facture = facture._id;

  return { cours: newCours, facture };
};

const payerFacture = async (id, res) => {
  const opts = { runValidators: true, new: true };
  try {
    const facture = await Facture.findOne({ _id: id });

    const cours = facture ? facture.cours : [];
    await Promise.all(
      cours.map(async (element) => {
        const cours = await Cours.findOne({ _id: element._id });
        !cours.closed
          ? () => {
              throw `cours ${cours._id} is still open`;
            }
          : "";
      })
    );

    await Facture.findOneAndUpdate(facture, { payee: true }, opts);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

module.exports = { createFactureAndCours, payerFacture };
