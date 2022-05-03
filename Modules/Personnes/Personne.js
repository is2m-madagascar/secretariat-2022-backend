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

  sexeM: {
    type: Boolean,
  },

  //pour les enseignants
  grade: {
    type: String,
    default: null,
  },

  //email, phone, etc
  contacts: {
    type: [{ contactType: String, contactValue: String }],
    required,
    default: [],
  },

  adress: {
    type: [String],
    required,
    default: [],
  },

  parents: {
    type: [
      {
        nom: { type: String },
        prenoms: { type: String },
        sexeM: { type: Boolean },
        email: { type: String },
        phones: { type: [String] },
        relation: { type: String },
        adress: { type: String },
        profession: {
          type: { profession: String, societe: String, adresse: String },
        },
      },
    ],
    default: [],
  },

  password: {
    type: String,
    select: false,
    required,
    default: "is2m",
  },

  diplome: {
    type: [
      {
        designation: String,
        mention: String,
        equivalence: String,
        anneeObt: Number,
      },
    ],
    default: [],
  },

  created: {
    type: Date,
    required,
    default: new Date(),
  },

  lastUpdated: {
    type: Date,
  },

  photoAdress: {
    type: String,
    default: "https://material.angular.io/assets/img/examples/shiba1.jpg",
  },
});

PersonneSchema.plugin(mongoosePaginate);
PersonneSchema.index(
  { "nomPrenom.nom": 1, "nomPrenom.prenoms": 1 },
  { unique: true }
);

module.exports = mongoose.model("Personne", PersonneSchema);
