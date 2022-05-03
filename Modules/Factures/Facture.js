const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("../../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const FacturationSchema = new Schema({
  anneeScolaire: { type: Number, required },

  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Personne",
    required,
  },

  mois: { type: Number, required },

  montantTotal: { type: Number, required, default: 0 },

  cours: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cours" }] },

  payee: { type: Boolean, default: false },
});

FacturationSchema.plugin(mongoosePaginate);
FacturationSchema.index(
  {
    anneeScolaire: 1,
    mois: 1,
    enseignant: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("Facturation", FacturationSchema);
