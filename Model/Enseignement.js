const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const EnseignementSchema = new Schema({
  anneeScolaire: { type: Number, required }, // 2021
  niveauEnseigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Niveau",
    required,
  }, // L1
  mention: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mention" }],
    required,
  }, // MI
  elementConstitutif: { type: { code: String, ec: String }, required }, // Algebre 1
  uniteEnseignement: { type: { code: String, ue: String }, required },
  volumeHoraire: {
    type: {
      days: { type: Number, default: 0 },
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    required,
    default: { days: 0, hours: 0, minutes: 0 },
  }, //15
  volumeConsomme: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Cours",
    required,
    default: [],
  },
  semestre: { type: Number },
  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Personne" },
});

EnseignementSchema.plugin(mongoosePaginate);
EnseignementSchema.index(
  {
    anneeScolaire: 1,
    enseignant: 1,
    "elementConstitutif.code": 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Enseignement", EnseignementSchema);
