const QueryUtils = require("./QueryUtils");

const handleQueryRequest = (req) => {
  const conditions = [];

  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;

  const queries = Object.keys(req.query);

  queries.forEach((element) => {
    const keyValue = {};

    if (
      /^\d/.test(req.query[element]) ||
      req.query[element] === "true" ||
      req.query[element] === "false"
    ) {
      keyValue[element] = req.query[element];
    } else {
      keyValue[element] = QueryUtils.regexp(req.query[element]);
    }

    if (((element !== "page") ^ (element !== "pageSize")) === 0) {
      //(page XOR pageSize)
      conditions.push(keyValue);
    }
  });

  conditions.length === 0 ? conditions.push({}) : "";

  const searchConditions = {
    $and: conditions,
  };

  return { searchConditions, page, limit };
};

module.exports = { handleQueryRequest };
