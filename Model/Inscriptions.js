const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;

const InscriptionSchema = new Schema({
  matricule: {
    type: Number,
    required: [true, MessageUtils.REQUIRED],
  },
  dateInscription: {
    type: Date,
    required: [true, MessageUtils.REQUIRED],
  },
  anneeScolaire: {
    type: Number,
    required: [true, MessageUtils.REQUIRED],
  },
  niveau: { type: String, required: [true, MessageUtils.REQUIRED] },
  mention: { type: { mention: String, code: String, specialisation: String } },
});

InscriptionSchema.plugin(mongoosePaginate);
InscriptionSchema.index({ anneeScolaire: 1, matricule: 1 }, { unique: true });

module.exports = mongoose.model("Inscription", InscriptionSchema);
