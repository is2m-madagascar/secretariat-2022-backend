const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const EcolageSchema = new Schema({
  matricule: { type: Number, required },
  anneeScolaire: { type: Number, required },
  montantTotal: {
    type: { fraisInsc: Number, fraisFormation: Number },
    required,
  },
  paiementsEffectues: {
    type: [{ mois: String, montant: Number, datePaiement: Date }],
  },
});

EcolageSchema.plugin(mongoosePaginate);
EcolageSchema.index({ anneeScolaire: 1, matricule: 1 }, { unique: true });

module.exports = mongoose.model("Ecolage", EcolageSchema);
