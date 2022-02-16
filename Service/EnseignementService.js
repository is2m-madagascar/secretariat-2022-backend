const Enseignement = require("./../Model/Enseignement");
const Personne = require("./../Model/Personne");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const moment = require("moment");
const QueryRequest = require("./../Utils/QueryRequest");

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
  enseignement.semestre = req.body.semestre;

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
    const enseignement = await Enseignement.findOne(condition).populate(
      "enseignant"
    );
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

module.exports = {
  createEnseignement,
  importEnseignements,
  getEnseignementById,
  getEnseignements,
  updateEnseignement,
};
