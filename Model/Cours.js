const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const CoursSchema = new Schema({
  volumeConsomme: {
    type: {
      days: { type: Number, default: 0 },
      hours: { type: Number, default: 0 },
      minutes: { type: Number, default: 0 },
    },
    required,
    default: { days: 0, hours: 0, minutes: 0 },
  },
  dateHeureDebut: { type: Date, default: new Date(), required },
  dateHeureFin: { type: Date },
  description: { type: [String] },
  remarques: { type: [String] },
  absences: { type: [String] },
  enseignement: {type: mongoose.Schema.Types.ObjectId, ref: "Enseignement"}
});

CoursSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Cours", CoursSchema);
