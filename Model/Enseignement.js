const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const EnseignementSchema = new Schema({
  anneeScolaire: { type: Number, required }, // 2021
  niveauEnseigne: { type: String, required }, // L1
  mention: {
    type: [
      {
        mention: { type: String },
        code: { type: String },
        specialisations: { type: String },
      },
    ],
    required,
  }, // MI
  elementConstitutif: { type: String, required }, // Algebre 1
  volumeHoraire: { type: Number, required }, //15
  matriculeEnseignant: { type: Number },
});

EnseignementSchema.plugin(mongoosePaginate);
EnseignementSchema.index(
  { anneeScolaire: 1, matriculeEnseignant: 1, elementConstitutif: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enseignement", EnseignementSchema);
