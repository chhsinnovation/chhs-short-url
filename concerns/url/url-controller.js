const errors = require('../../utils/errors');
const validator = require('./url-validator');
const url = require('./url-model');

const create = async event => {
  try {
    const eventBody = await validator.assessor(event.body);

    const s3Response = await url.upload(eventBody.Url);
    
    return [null, s3Response];
  } catch (error) {
    console.log(error, error.stack);
    return [errors.respondWith(error), null];
  }
};

const batch = async event => {
  try {
    const eventBody = await validator.batchAssessor(event.body);
    
    const urls = [...new Set(eventBody.map(obj => obj.Url))];

    const promises = urls.map(u => url.upload(u));
    const jobs = await Promise.all(promises);
    
    return [null, jobs];
  } catch (error) {
    console.log(error, error.stack);
    return [errors.respondWith(error), null];
  }
};

module.exports = {
  create,
  batch
};