const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;

const inscriptionSchema = new Schema({
  matricule: {
    type: Number,
    required: [true, MessageUtils.REQUIRED],
  },
  dateInscription: {
    type: Date,
    required: [true, MessageUtils.REQUIRED],
  },
  anneeScolaire: {
    type: { annee1: Number, annee2: Number },
    required: [true, MessageUtils.REQUIRED],
  },
  niveau: { type: String, required: [true, MessageUtils.REQUIRED] },
  mention: { type: { mention: String, code: String, specialisation: String } },
});

inscriptionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Insciption", inscriptionSchema);
