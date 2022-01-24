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

module.exports = {
  regexp,
  handleCases,
};
