const Enseignement = require("./../Model/Enseignement");
const Personne = require("./../Model/Personne");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const QueryUtils = require("./../Utils/QueryUtils");
const moment = require("moment");

const createEnseignement = async (req, res) => {
  const enseignement = new Enseignement();

  enseignement.anneeScolaire = req.body.anneeScolaire;
  enseignement.niveauEnseigne = req.body.niveauEnseigne;
  enseignement.mention = req.body.mention;
  enseignement.elementConstitutif = req.body.elementConstitutif;

  const duree = moment.duration({ hours: req.body.volumeHoraire });
  enseignement.volumeHoraire = { days: 0, hours: 0, minutes: 0 };
  enseignement.volumeHoraire.days = duree.days();
  enseignement.volumeHoraire.hours = duree.hours();
  enseignement.volumeHoraire.minutes = duree.minutes();

  //enseignement.matriculeEnseignant = req.body.matriculeEnseignant;

  const enseignant = await Personne.findOne({
    matricule: req.body.matriculeEnseignant,
  });

  enseignement.enseignant = enseignant._id;

  console.log("enseignement reçu");
  console.log(enseignement.populate("enseignant"));

  try {
    await enseignement.save();
    enseignement.enseignant ? enseignement.populate("enseignant") : "";
    return ResponseHandling.handleResponse(enseignement);
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

      const enseignant = await Personne.findOne({
        matricule: element.matriculeEnseignant,
      });
      temp.enseignant = enseignant._id;

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

  const enseignement = await Enseignement.findOne(condition).populate(
    "enseignant"
  );

  try {
    return enseignement
      ? ResponseHandling.handleResponse(enseignement, res, MessageUtils.GET_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (err) {
    return ResponseHandling.handleError(err, res);
  }
};

const getEnseignements = async (req, res) => {
  const conditions = [];

  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;

  req.query.anneeScolaire
    ? conditions.push({ anneeScolaire: { $eq: req.query.anneeScolaire } })
    : "";
  req.query.matriculeEnseignant
    ? conditions.push({ matricule: { $eq: req.query.matriculeEnseignant } })
    : "";
  req.query.niveauEnseigne
    ? conditions.push({ niveauEnseigne: { $eq: req.query.niveauEnseigne } })
    : "";
  req.query.elementConstitutif
    ? conditions.push({
        elementConstitutif: { $eq: req.query.elementConstitutif },
      })
    : "";

  conditions.length === 0 ? conditions.push({}) : "";

  console.log(conditions);

  const searchConditions = {
    $and: conditions,
  };

  try {
    const enseignements = await Enseignement.paginate(searchConditions, {
      page,
      limit,
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

    const newEns = await Promise.all(
      enseignements.docs.map(
        async (element) => await element.populate("enseignant")
      )
    );
    return ResponseHandling.handleResponse(newEns, res, message);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const updateEnseignement = async (req, res) => {
  const condition = { _id: req.body._id };
  const opts = { runValidators: true, new: true };

  const updatedEnseignement = req.body;

  try {
    //try enseignement
    if (req.body.matriculeEnseignant) {
      //Misy ve ny matriculeEnseignant?

      try {
        // try enseignant
        const enseignant = await Personne.findOne({
          // Mitady ilay enseignant amin'ny alalan'ilay matricule
          matricule: req.body.matriculeEnseignant,
        });
        enseignant
          ? (updatedEnseignement.enseignement = enseignant._id) // Raha hita ilay enseignant dia omena ny reference
          : () => {
              return ResponseHandling.handleNotFound(res); // Raha tsy hita ilay enseignant
            };
      } catch (e) {
        //catch enseignant
        return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
      }
    }

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

module.exports = {
  createEnseignement,
  importEnseignements,
  getEnseignementById,
  getEnseignements,
  updateEnseignement,
};
