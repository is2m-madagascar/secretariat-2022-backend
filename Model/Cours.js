const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const CoursSchema = new Schema({
  enseignement: { type: mongoose.Schema.Types.ObjectId, ref: "Enseignement" },

  debut: { type: Date, default: new Date(), required },

  fin: { type: Date },

  volumeConsomme: {
    type: {
      days: { type: Number },
      hours: { type: Number },
      minutes: { type: Number, default: 0 },
    },
  },

  enseignant: { type: mongoose.Schema.Types.ObjectId, ref: "Personne" },
  
  facture: { type: mongoose.Schema.Types.ObjectId, ref: "Facture" },

  closed: { type: Boolean, required: true, default: false },
});

CoursSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Cours", CoursSchema);
