/**
 * retourne le RegExp "commence par" la valeur de req.query.toto
 * @param {String} selector début du mot à rechercher
 * @returns regexp ou null
 */
const createStringQuery = (selector) => {
  return selector ? new RegExp("^" + selector) : null;
};

/**
 * retourne la comparaison entre un nombre et une valeur enregistré dans la base de données
 * @param {Number} value la valeur à comparer
 * @param {String} operator l'opération de comparaison $eq -> equals , $lt -> less than , etc -> see mongoose documentation
 * @returns l'opération de comparaison
 */
const createNumberQuery = (value, operator) => {
  const keyValue = {};
  keyValue[operator] = value;
  return keyValue;
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
    console.log("Eto -> " + key + "-> " + keyValue.value);
    //verifie si la valeur n'est pas null et l'ajoute à un nouveau tableau
    keyValue.value ? table.push(keyValue) : "";
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

module.exports = {
  createStringQuery,
  createNumberQuery,
  compileQuery,
  handleCases,
};
