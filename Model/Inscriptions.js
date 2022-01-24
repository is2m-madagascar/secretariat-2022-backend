const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const InscriptionSchema = new Schema({
  matricule: {
    type: Number,
    required,
  },
  dateInscription: {
    type: Date,
    required,
  },
  anneeScolaire: {
    type: Number,
    required,
  },
  niveau: { type: String, required },
  mention: { type: { mention: String, code: String, specialisation: String } },
});

InscriptionSchema.plugin(mongoosePaginate);
InscriptionSchema.index({ anneeScolaire: 1, matricule: 1 }, { unique: true });

module.exports = mongoose.model("Inscription", InscriptionSchema);
