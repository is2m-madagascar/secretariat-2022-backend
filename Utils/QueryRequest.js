const handleQueryRequest = (req) => {
  const conditions = [];

  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;

  const queries = Object.keys(req.query);

  queries.forEach((element) => {
    const keyValue = {};
    keyValue[element] = req.query[element];

    //(page XOR pageSize)
    if (((element !== "page") ^ (element !== "pageSize")) === 0) {
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
