import mongoose from "mongoose";
const { Schema } = mongoose;

const PersonneSchema = new Schema({
    matricule: Number
})

export { PersonneSchema }