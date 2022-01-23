const Response = require("./../Model/ApiResponse");
const MessageUtils = require("./MessageUtils");

const handleError = (err, res) => {
  const response = new Response.ApiResponse({
    data: [],
    errors: [err.message],
    message: MessageUtils.ERROR,
  });
  console.log(response);
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

const handleNotFound = (res, message) => {
  const response = new Response.ApiResponse({
    data: [],
    errors: ["Ressource not found"],
    message: MessageUtils.NOT_FOUND,
  });

  console.log(response);
  return res.status(404).json(response);
};

module.exports = { handleError, handleResponse, handleNotFound };
