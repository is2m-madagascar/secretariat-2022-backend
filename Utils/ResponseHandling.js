const Response = require("./../Model/ApiResponse");
const MessageUtils = require("./MessageUtils");

const handleError = (err, res, message) => {
  const response = new Response.ApiResponse({
    data: [],
    errors: [err.message || err],
    message: message || MessageUtils.ERROR,
  });
  console.log(response);
  try {
    console.log(err.line);
  } catch (e) {}
  return res.status(500).json(response);
};

const handleResponse = (data, res, message) => {
  const response = new Response.ApiResponse({
    data: [data],
    errors: [],
    message,
  });

  console.log(response);
  return res.status(200).json(response);
};

const handleNotFound = (res) => {
  const response = new Response.ApiResponse({
    data: [],
    errors: ["Ressource not found"],
    message: MessageUtils.NOT_FOUND,
  });

  console.log(response);
  return res.status(404).json(response);
};

const handlePagination = (req, res, Model, searchConditrions) => {
  /* Pagination */
  const page = req.query.page < 1 ? 1 : req.query.page || 1;
  //page size
  const limit = req.query.pageSize || process.env.PAGE_SIZE || 10;
  /* End pagination*/

  Model.paginate(searchConditrions, { page, limit })
    .then((result) => {
      const totalElements = result.total;
      const pages = result.pages;
      const message = {
        pagination: {
          totalElements,
          pages,
          pageSize: parseInt(limit),
          page: parseInt(page),
        },
        statusMessage: MessageUtils.GET_OK,
      };
      return handleResponse(result.docs, res, message);
    })
    .catch((err) => {
      return handleError(err, res);
    });
};

module.exports = {
  handleError,
  handleResponse,
  handleNotFound,
  handlePagination,
};
