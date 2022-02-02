const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const InscriptionSchema = new Schema({
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    required,
    ref: "Personne",
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
  ecolage: {
    type: {
      montantTotal: {
        type: {
          fraisInsc: { type: Number },
          fraisFormation: { type: Number },
        },
      },
      paiementsEffectues: {
        type: [
          {
            montant: { type: [Number] },
            datePaiement: { type: Date },
            motif: { type: [String] },
          },
        ],
      },
    },
  },
});

InscriptionSchema.plugin(mongoosePaginate);
InscriptionSchema.index({ anneeScolaire: 1, matricule: 1 }, { unique: true });

module.exports = mongoose.model("Inscription", InscriptionSchema);
