const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

const { Schema } = mongoose;

const PersonneSchema = new Schema({
  matricule: {
    type: Number,
    required: [true, "Matricule is required"],
    unique: true,
    min: 1,
  },

  nomPrenom: {
    type: { nom: String, prenoms: String },
    required: [true, "Nom and Prenoms are required"],
  },

  statut: {
    type: String,
    required: [true, "Statut is required"],
  },
});

PersonneSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Personne", PersonneSchema);
