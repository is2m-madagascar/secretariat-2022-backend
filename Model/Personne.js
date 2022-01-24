const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.require];

const PersonneSchema = new Schema({
  matricule: {
    type: Number,
    required,
    unique: true,
    min: 1,
  },

  nomPrenom: {
    type: { nom: String, prenoms: String },
    required,
  },

  statut: {
    type: String,
    required,
  },
});

PersonneSchema.plugin(mongoosePaginate);
PersonneSchema.index(
  { "nomPrenom.nom": 1, "nomPrenom.prenoms": 1 },
  { unique: true }
);

module.exports = mongoose.model("Personne", PersonneSchema);
