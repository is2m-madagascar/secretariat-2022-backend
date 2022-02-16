const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGO_STRING_CONNECTION;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToMongo = () => {
  mongoose.Promise = global.Promise;
  // set to false if debug not wanted
  mongoose.set("debug", false);

  mongoose
    .connect(uri, options)
    .then(() => {
      console.log("Connecté à la base MongoDB");
    })
    .catch((err) => {
      console.error(err);
      setTimeout(() => connectToMongo(uri, options), 5000);
    });
};

module.exports = { connectToMongo };
