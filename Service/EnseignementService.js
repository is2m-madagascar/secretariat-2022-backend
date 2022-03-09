const Enseignement = require("./../Model/Enseignement");
const Personne = require("./../Model/Personne");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const moment = require("moment");
const QueryRequest = require("./../Utils/QueryRequest");
const Cours = require("./../Model/Cours");
const Facture = require("./../Model/Facture");
const _underscore = require("underscore");

const populate = ["niveauEnseigne", "mention", "enseignant", "volumeConsomme"];

const createEnseignement = async (req, res) => {
  const enseignement = new Enseignement();

  enseignement.anneeScolaire = req.body.anneeScolaire;
  enseignement.niveauEnseigne = req.body.niveauEnseigne;
  enseignement.mention = req.body.mention;
  enseignement.elementConstitutif = req.body.elementConstitutif;
  enseignement.uniteEnseignement = req.body.uniteEnseignement;
  const duree = moment.duration({ hours: req.body.volumeHoraire });
  enseignement.volumeHoraire = {
    days: duree.days(),
    hours: duree.hours(),
    minutes: duree.minutes(),
  };
  enseignement.semestre = req.body.semestre;
  console.log("enseignement reçu");
  try {
    const enseignant = await Personne.findOne({
      matricule: req.body.matriculeEnseignant,
    });

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant not found." });
    }
    enseignement.enseignant = enseignant._id;
    enseignement.save((err, savedDocs) => {
      if (err) {
        return ResponseHandling.handleError(err, res);
      } else {
        return ResponseHandling.handleResponse(
          savedDocs,
          res,
          MessageUtils.GET_OK
        );
      }
    });
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const importEnseignements = async (req, res) => {
  const enseignements = [];
  const enseignementsRecu = req.body;

  await Promise.all(
    enseignementsRecu.map(async (element) => {
      const temp = new Enseignement();

      temp.anneeScolaire = element.anneeScolaire;
      temp.niveauEnseigne = element.niveauEnseigne;
      temp.mention = element.mention;
      temp.elementConstitutif = element.elementConstitutif;
      const duree = moment.duration({ hours: element.volumeHoraire });
      temp.volumeHoraire = { days: 0, hours: 0, minutes: 0 };
      temp.volumeHoraire.days = duree.days();
      temp.volumeHoraire.hours = duree.hours();
      temp.volumeHoraire.minutes = duree.minutes();
      temp.semestre = element.semestre;

      const enseignant = await Personne.findOne({
        matricule: element.enseignant,
      });
      temp.enseignant = enseignant ? enseignant._id : null;

      enseignements.push(temp);
    })
  );

  console.log("enseignements reçus");
  console.log(enseignements);

  const options = { populate: "enseignant" };
  try {
    const enseignementsList = await Enseignement.insertMany(
      enseignements,
      options
    );
    return ResponseHandling.handleResponse(
      enseignementsList,
      res,
      MessageUtils.POST_OK
    );
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};
  
const getEnseignementById = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const enseignement = await Enseignement.findOne(condition, null, {
      populate,
    });
    return enseignement
      ? ResponseHandling.handleResponse(enseignement, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (err) {
    return ResponseHandling.handleError(err, res);
  }
};

const getEnseignements = async (req, res) => {
  const { searchConditions, page, limit } =
    QueryRequest.handleQueryRequest(req);

  console.log(JSON.stringify(searchConditions));

  try {
    const enseignements = await Enseignement.paginate(searchConditions, {
      page,
      limit,
      sort: { semestre: 1 },
      populate,
    });

    const message = {
      pagination: {
        totalElements: enseignements.total,
        pages: enseignements.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return ResponseHandling.handleResponse(enseignements, res, message);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const addCoursToEns = async (req, res) => {
  const condition = { _id: req.params.idEns };

  try {
    //Cherche enseignement
    const ens = await Enseignement.findOne({ condition }, null, {
      populate,
    });

    //Si on ne trouve aucun enseignement
    if (!ens) {
      return ResponseHandling.handleNotFound(res);
    }

    //Ajouter cours au champ correspondant à l'enseignement
    const cours = ens.volumeConsomme;

    //Si tableau des cours vide ou dernier element a une date de fin => on peut inscrire le cours
    if (cours.length === 0 || cours.slice(-1).dateHeureFin !== undefined) {
      const newCoursAdded = buildCours(req);
      newCoursAdded.enseignement = ens._id;
      await newCoursAdded.save();
      cours.push(newCoursAdded._id);
    }
    // Sinon on ne peut pas
    else {
      return ResponseHandling.handleError(
        new Error("Cannot add cours"),
        res,
        "Le cours précédent n'est pas terminé"
      );
    }

    //Commit modification enseignement
    const ensToUpdate = await Enseignement.findOneAndUpdate(condition, ens, {
      new: true,
    });

    //Si on ne trouve pas l'enseignement
    if (!ensToUpdate) {
      return ResponseHandling.handleNotFound(res);
    }

    //Retourner la réponse
    return ResponseHandling.handleResponse(
      ensToUpdate,
      res,
      MessageUtils.PUT_OK
    );
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const closeCours = async (req, res) => {
  const condition = { _id: req.params.idEns };
  try {
    //Chercher l'enseignement
    const ens = await Enseignement.findOne({ condition }, null, {
      populate,
    });

    //Fermeture du cours
    const coursRef = ens.volumeConsomme.slice(-1);
    const cours = await Cours.findOne({ _id: coursRef });
    let updateTemp = null;
    if (!cours.dateHeureFin) {
      cours.dateHeureFin = new Date();
      const momentFin = cours.dateHeureFin;
      const momentDebut = cours.dateHeureDebut;
      const duree = moment.duration(
        moment(momentFin).subtract(moment(momentDebut))
      );

      cours.volumeConsomme = {
        days: duree.days(),
        hours: duree.hours(),
        minutes: duree.minutes(),
      };

      updateTemp = buildCours(req);
      updateTemp.volumeConsomme = cours.volumeConsomme;
      updateTemp.dateHeureFin = cours.dateHeureFin;
      updateTemp.dateHeureDebut = cours.dateHeureDebut;
    } else {
      return ResponseHandling.handleError(
        new Error("Cannot close cours"),
        res,
        "Le cours est déjà clos"
      );
    }

    const bodyTemp = _underscore.omit(updateTemp.toJSON(), "_id");

    const coursToUpdate = await Cours.findOneAndUpdate(
      { _id: cours._id },
      bodyTemp,
      {
        new: true,
      }
    );

    //ajouter à une facture

    //verifier s'il existe une facture non payé pour le prof
    let facture = await Facture.findOne({
      enseignant: ens.enseignant,
      payee: false,
    });

    //Non
    //Créer la facture
    if (!facture) {
      facture = new Facture();
      facture.anneeScolaire = ens.anneeScolaire || new Date().getFullYear();
      facture.enseignant = ens.enseignant;
      facture.cours = [cours._id];
      await facture.save();
    }
    //Oui
    //Ajouter le cours à la facture
    else {
      facture.cours.push(cours._id);
      await Facture.findOneAndUpdate(
        { _id: facture._id },
        { cours: facture.cours }
      );
    }

    return ResponseHandling.handleResponse(
      coursToUpdate,
      res,
      MessageUtils.PUT_OK
    );
  } catch (e) {
    console.log(e.lineNumber);
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const updateEnseignement = async (req, res) => {
  const condition = { _id: req.body._id };
  const updatedEnseignement = req.body;

  try {
    //try enseignement
    if (req.body.matriculeEnseignant) {
      //Misy ve ny matriculeEnseignant?

      const enseignant = await Personne.findOne({
        // Mitady ilay enseignant amin'ny alalan'ilay matricule
        matricule: req.body.matriculeEnseignant,
      });
      enseignant
        ? (updatedEnseignement.enseignement = enseignant._id) // Raha hita ilay enseignant dia omena ny reference
        : () => {
            return ResponseHandling.handleNotFound(res); // Raha tsy hita ilay enseignant
          };
    }

    const opts = { runValidators: true, new: true };
    const enseignement = await Enseignement.findOneAndUpdate(
      condition,
      updatedEnseignement,
      opts
    );

    return ResponseHandling.handleResponse(
      enseignement,
      res,
      MessageUtils.PUT_OK
    );
  } catch (e) {
    //catch enseignement
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

//Utils functions
const buildCours = (req) => {
  const newCoursToAdd = new Cours();
  newCoursToAdd.description = req.body.description;
  newCoursToAdd.remarques = req.body.remarques;
  newCoursToAdd.absences = req.body.absences;
  return newCoursToAdd;
};

module.exports = {
  createEnseignement,
  importEnseignements,
  getEnseignementById,
  getEnseignements,
  updateEnseignement,
  addCoursToEns,
  closeCours,
};
