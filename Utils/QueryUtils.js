/**
 * retourne le RegExp "commence par" la valeur de req.query.toto
 * @param {String} selector début du mot à rechercher
 * @returns regexp ou null
 */
const regexp = (selector) => {
  return selector ? new RegExp("^" + selector) : null;
};

const handleCases = (
  err,
  data,
  okCallback,
  errorCallback,
  notFoundCallback
) => {
  if (err) {
    errorCallback();
  } else {
    if (data) {
      okCallback();
    } else {
      notFoundCallback();
    }
  }
};

const setCorsPolicy = (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
  );
  next();
};

module.exports = {
  regexp,
  handleCases,
  setCorsPolicy,
};
