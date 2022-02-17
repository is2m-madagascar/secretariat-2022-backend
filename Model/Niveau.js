const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.require];

const NiveauSchema = new Schema({
  niveau: { type: String, required },
  montantTotal: {
    type: [
      {
        fraisInsc: { type: Number },
        fraisFormation: { type: Number },
        updated: { type: Date },
      },
    ],
    required,
  },
});

NiveauSchema.plugin(mongoosePaginate);
NiveauSchema.index({ niveau: 1 }, { unique: true });

module.exports = mongoose.model("Niveau", NiveauSchema);
