const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("./../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.require];

const MentionSchema = new Schema({
  mentionName: { type: String, required },
  mentionCode: { type: String, required },
  specialisations: { type: [{ code: String, spec: String }], required },
});

MentionSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Mention", MentionSchema);
