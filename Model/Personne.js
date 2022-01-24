const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;

const PersonneSchema = new Schema({
  matricule: {
    type: Number,
    required: [true, MessageUtils.REQUIRED],
    unique: true,
    min: 1,
  },

  nomPrenom: {
    type: { nom: String, prenoms: String },
    required: [true, MessageUtils.REQUIRED],
  },

  statut: {
    type: String,
    required: [true, MessageUtils.REQUIRED],
  },
});

PersonneSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Personne", PersonneSchema);
