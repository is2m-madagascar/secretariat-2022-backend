const Cours = require("./../Model/Cours");
const Enseignement = require("./../Model/Enseignement");
const QueryUtils = require("./../Utils/QueryUtils");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const moment = require("moment");

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

      newCours.enseignant = enseignement._id;

      await newCours.save();
      return res.status(200).json({ message: "afaka" });
    } catch (e) {
      console.log(catched);
      return res.status(500).json({ message: e.message });
    }
  } else {
    return res.status(500).json({
      message: `Course ${cours.enseignement.elementConstitutif} is under achievement`,
    });
  }

  /*Cours.findOne(condition)
    .populate({ path: "enseignement", model: "Enseignement" })
    .exec((err, cours) => {
      QueryUtils.handleCases(
        err,
        cours,
        () => {
          //err

          return ResponseHandling.handleError(
            `Course from ${newCours.enseignement_id} is under achievement at ${cours._id}`,
            res,
            "A course is under achievement"
          );
        },
        () => {
          //err
          return ResponseHandling.handleError(err, res);
        },
        () => {
          //ok
          console.log("cours reçu");
          console.log(newCours);

          newCours.save((err) => {
            QueryUtils.handlePostSave(err, res, newCours);
          });
        }
      );
    });*/
};

const fermerCours = (req, res) => {
  const condition = { _id: req.params.id };

  Cours.findOne(condition, (err, cours) => {
    QueryUtils.handleCases(
      err,
      cours,
      () => {
        if (cours.fin) {
          return ResponseHandling.handleError(err, res);
        }
        cours.fin = new Date();
        const momentFin = moment(cours.fin);
        const momentDebut = moment(cours.debut);

        const duree = moment.duration(momentFin.subtract(momentDebut));

        cours.volumeConsomme = {};

        cours.volumeConsomme.days = duree.days();
        cours.volumeConsomme.hours = duree.hours();
        cours.volumeConsomme.minutes = duree.minutes();
        cours.closed = true;

        const condition = { _id: cours._id };
        const opts = { runValidators: true, new: true };

        Cours.findOneAndUpdate(condition, cours, opts, (err, cours) => {
          QueryUtils.handleCases(
            err,
            cours,
            () => {
              return ResponseHandling.handleResponse(
                cours,
                res,
                MessageUtils.PUT_OK
              );
            },
            () => {
              return ResponseHandling.handleError(err, res);
            },
            () => {
              return ResponseHandling.handleNotFound(res);
            }
          );
        });
      },
      () => {
        return ResponseHandling.handleError(err, res);
      },
      () => {
        return ResponseHandling.handleNotFound(res);
      }
    );
  });
};

const getCoursById = async (req, res) => {
  const condition = { _id: req.params.id };

  const cours = await Cours.findOne(condition)
    .populate("enseignement")
    .populate("enseignant");
  return res.status(200).json(cours);
  /*QueryUtils.handleCases(
    "No err",
    cours,
    () => {
      return ResponseHandling.handleResponse(cours, res, MessageUtils.GET_OK);
    },
    () => {
      return ResponseHandling.handleError("No err", res);
    },
    () => {
      return ResponseHandling.handleNotFound(res);
    }
  );*/
};

const getCours = (req, res) => {
  const conditions = [];

  req.query.enseignement_id
    ? conditions.push({ enseignement_id: { $eq: req.query.enseignement_id } })
    : "";

  conditions.length === 0 ? conditions.push({}) : "";

  console.log(conditions);

  const searchConditions = {
    $and: conditions,
  };

  return ResponseHandling.handlePagination(req, res, Cours, searchConditions);
};

module.exports = { ouvrirCours, fermerCours, getCoursById, getCours };
