const Variables = require("./../Config/Variables");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");

const makeResponse = (variable, res) => {
  return ResponseHandling.handleResponse(variable, res, MessageUtils.GET_OK);
};

const getVariables = (req, res) => {
  const variableToGet = req.params.variable;

  switch (variableToGet) {
    case "niveaux":
      return makeResponse(Variables.niveaux, res);

    case "mentions":
      return makeResponse(Variables.mentions, res);

    case "fraisInscription":
      return makeResponse(Variables.fraisInscription, res);

    case "grades":
      return makeResponse(Variables.grades, res);

    default:
      return ResponseHandling.handleError(error, res);
  }
};

module.exports = {
  getVariables,
};
