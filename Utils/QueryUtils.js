const MessageUtils = require("./MessageUtils");

/**
 * req.query.toto -> retourn le RegExp "commence par" la valeur de req.query.toto
 * @param {*} selector
 * @returns regexp ou null
 */
const createQuery = (selector) => {
  return selector ? new RegExp("^" + selector) : null;
};

/**
 * Prend en paramètre un tableau de requêtte et enlève les valeurs null du tableau
 * @param {*} queryTable tableau à filtrer
 * @returns tableau sans les valeurs null
 */
const compileQuery = (queryTable) => {
  const table = [];
  queryTable.forEach((element) => {
    const key = Object.keys(element)[0];
    const value = element[key];
    const keyValue = {};
    keyValue[key] = value;
    //verifie si la valeur n'est pas null et l'ajoute à un nouveau tableau
    value ? table.push(keyValue) : "";
  });
  return table;
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

module.exports = { createQuery, compileQuery, handleCases };
