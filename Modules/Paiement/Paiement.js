const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.require];

const PaiementSchema = new Schema({
  personne: { type: mongoose.Schema.Types.ObjectId, required, ref: "Personne" },
  montant: { type: Number },
  datePaiement: { type: Date, default: new Date() },
  motif: { type: String },
  sens: { type: Boolean, required },
  anneeScolaire: { type: Number, required },
});

MentionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Paiement", PaiementSchema);
