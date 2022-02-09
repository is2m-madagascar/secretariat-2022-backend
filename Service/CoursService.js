const Cours = require("./../Model/Cours");
const facturationRepository = require("./../Repository/FacturationRepository");
const Enseignement = require("./../Model/Enseignement");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const moment = require("moment");
const QueryRequest = require("./../Utils/QueryRequest");

const ouvrirCours = async (req, res) => {
  const newCours = new Cours();

  newCours.enseignement = req.body.enseignement_id;

  //Raha mahita cours mihidy izay vao mety
  const condition = {
    enseignement_id: req.body.enseignement_id,
    closed: false,
  };

  const cours = await Cours.findOne(condition).populate("enseignement");

  if (!cours) {
    try {
      const enseignement = await Enseignement.findOne({
        _id: newCours.enseignement,
      });
      if (!enseignement) {
        return ResponseHandling.handleNotFound(res);
      }

      newCours.enseignant = enseignement._id;

      //TODO transactions
      const { cours, facture } =
        await facturationRepository.createFactureAndCours(newCours, req);
      //end transactions

      await cours.save();

      const showCours = await Cours.findOne({ cours })
        .populate("enseignement")
        .populate("enseignant");

      //console.log({ cours, facture });

      return ResponseHandling.handleResponse(
        showCours,
        res,
        MessageUtils.POST_OK
      );
    } catch (e) {
      return ResponseHandling.handleError(e, res);
    }
  } else {
    return res.status(500).json({
      message: `Course ${cours.enseignement.elementConstitutif} is under achievement`,
    });
  }
};

const fermerCours = async (req, res) => {
  try {
    const condition = { _id: req.params.id };
    const cours = await Cours.findOne(condition);

    if (!cours) {
      return ResponseHandling.handleNotFound(res);
    }

    if (cours.fin) {
      return ResponseHandling.handleError(err, res);
    } else {
      cours.fin = new Date();
      const momentFin = moment(cours.fin);
      const momentDebut = moment(cours.debut);

      const duree = moment.duration(momentFin.subtract(momentDebut));

      cours.volumeConsomme = {};
      cours.volumeConsomme.days = duree.days();
      cours.volumeConsomme.hours = duree.hours();
      cours.volumeConsomme.minutes = duree.minutes();
      cours.closed = true;

      const opts = { runValidators: true, new: true };

      const updatedCours = await Cours.findOneAndUpdate(condition, cours, opts);
      return ResponseHandling.handleResponse(
        updatedCours,
        res,
        MessageUtils.PUT_OK
      );
    }
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

const getCoursById = async (req, res) => {
  const condition = { _id: req.params.id };

  try {
    const cours = await Cours.findOne(condition)
      .populate("enseignement")
      .populate("enseignant");
    return ResponseHandling.handleResponse(cours, res, MessageUtils.GET_OK);
  } catch (e) {
    return ResponseHandling.handleError(e);
  }
};

const getCours = async (req, res) => {
  const { searchConditions, page, limit } =
    QueryRequest.handleQueryRequest(req);

  try {
    const cours = await Cours.paginate(searchConditions, {
      limit,
      page,
      populate: ["enseignement", "enseignant"],
    });

    const message = {
      pagination: {
        totalElements: cours.total,
        pages: cours.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };

    return ResponseHandling.handleResponse(cours.docs, res, message);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

module.exports = { ouvrirCours, fermerCours, getCoursById, getCours };
