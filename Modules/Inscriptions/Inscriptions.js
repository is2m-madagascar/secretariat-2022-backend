const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const MessageUtils = require("../../Utils/MessageUtils");

const { Schema } = mongoose;
const required = [true, MessageUtils.REQUIRED];

const InscriptionSchema = new Schema({
    etudiant: {
        type: mongoose.Schema.Types.ObjectId,
        required,
        ref: "Personne",
    },

    dateInscription: {
        type: Date,
        required,
    },

    anneeScolaire: {
        type: Number,
        required,
    },

    niveau: { type: String },

    mention: {
        type: {
            mention: String,
            code: String,
            specialisation: {
                type: {
                    label: String,
                    code: String,
                }
            }
        },
        required,
    },

    /*paiements: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Paiement" }],
        required,
        default: [],
    },

    promotion: {
        type: Number,
        default: 0,
    },*/
});

InscriptionSchema.plugin(mongoosePaginate);
InscriptionSchema.index({ anneeScolaire: 1, etudiant: 1 }, { unique: true });

module.exports = mongoose.model("Inscription", InscriptionSchema);