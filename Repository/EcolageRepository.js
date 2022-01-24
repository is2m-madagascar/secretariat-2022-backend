const ResponseHandling = require("./../Utils/ResponseHandling");

const saveEcolage = (ecolage, res) => {
  ecolage.save((err) => {
    if (err) {
      return ResponseHandling.handleError(err, res);
    } else {
      console.log("Ecolage created");
    }
  });
};

module.exports = { saveEcolage };
