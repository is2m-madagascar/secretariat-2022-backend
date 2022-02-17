const Mention = require("./../Model/Mention");
const ResponseHandling = require("./../Utils/ResponseHandling");
const MessageUtils = require("./../Utils/MessageUtils");
const { handleQueryRequest } = require("../Utils/QueryRequest");

const createMention = async (req, res) => {
  const mention = new Mention();
  mention.mentionName = req.body.mentionName;
  mention.mentionCode = req.body.mentionCode;
  mention.specialisations = req.body.specialisations;
  console.log("Mention reçu");
  console.log(mention);
  try {
    await mention.save();
    return ResponseHandling.handleResponse(mention, res, MessageUtils.POST_OK);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const updateMention = async (req, res) => {
  const condition = { mentionCode: req.params.code };
  const opts = { runValidators: true, new: true };
  const mentionToUpdate = req.body;
  try {
    const mention = await Mention.findOneAndUpdate(
      condition,
      mentionToUpdate,
      opts
    );
    return mention
      ? ResponseHandling.handleResponse(mention, res, MessageUtils.PUT_OK)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const addSpecToMention = async (req, res) => {
  const condition = { mentionCode: req.params.code };
  const opts = { runValidators: true, new: true };
  const specialisationToAdd = req.body;

  try {
    const mention = await Mention.findOne(condition);
    const spec = mention.specialisations;
    spec.push(specialisationToAdd);

    const mentionToUpdate = await Mention.findOneAndUpdate(
      condition,
      { specialisations: spec },
      opts
    );

    return mentionToUpdate
      ? ResponseHandling.handleResponse(
          mentionToUpdate,
          res,
          MessageUtils.PUT_OK
        )
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const addSpecsToMention = async (req, res) => {
  const condition = { mentionCode: req.params.code };
  const opts = { runValidators: true, new: true };
  const specialisationsToAdd = req.body;

  try {
    const mention = await Mention.findOne(condition);
    const spec = mention.specialisations;
    const specs = spec.concat(specialisationsToAdd);

    const mentionToUpdate = await Mention.findOneAndUpdate(
      condition,
      { specialisations: specs },
      opts
    );

    return mentionToUpdate
      ? ResponseHandling.handleResponse(
          mentionToUpdate,
          res,
          MessageUtils.PUT_OK
        )
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res);
  }
};

const getMention = async (req, res) => {
  const { searchConditions, page, limit } = handleQueryRequest(req);
  console.log(searchConditions);
  try {
    const mention = await Mention.paginate(searchConditions, {
      page,
      limit,
      sort: { _id: -1 },
    });
    const message = {
      pagination: {
        totalElements: mention.total,
        pages: mention.pages,
        pageSize: parseInt(limit),
        page: parseInt(page),
      },
      statusMessage: MessageUtils.GET_OK,
    };
    return mention
      ? ResponseHandling.handleResponse(mention.docs, res, message)
      : ResponseHandling.handleNotFound(res);
  } catch (e) {
    return ResponseHandling.handleError(e, res, MessageUtils.ERROR);
  }
};

module.exports = {
  createMention,
  updateMention,
  getMention,
  addSpecToMention,
  addSpecsToMention,
};
