const deliver = require('../../utils/deliver');
const controller = require('./url-controller');

module.exports.create = async (event, context) => {
  const [error, response] = await controller.create(event);
  if (error) { return error; };
  return deliver.successful(response);
};

module.exports.batch = async (event, context) => {
  const [error, response] = await controller.batch(event);
  if (error) { return error; };
  return deliver.successful(response);
};