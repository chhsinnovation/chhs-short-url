const validate = require('../../utils/validate');
const format = require('../../utils/format');
const errors = require('../../utils/errors');


const batchProcessor = async (objects) => {
  const batch = await Promise.all(objects.map(object => Promise.resolve(object)
    .then(obj => validate.presence(obj, "Url"))
    .then(obj => validate.url(obj, "Url"))
    .catch(e => e.report)
  ));
  const failures = batch.filter(report => (report.hasOwnProperty("Error")));
  if (failures.length > 0) {
    throw new errors.APIBatchError(
      "CONTENT_FAILURES", 400, failures, 
      "Some Urls are invalid. Please fix and resubmit."
    );
  };

  return batch;
};


const assessor = object => {
  return Promise.resolve(object)
    .then(json => format.json(json))
    .then(obj => validate.presence(obj, "Url"))
    .then(obj => validate.url(obj, "Url"))
    .catch(error => { throw error; });
};

const batchAssessor = json => {
  return Promise.resolve(json)
    .then(json => format.json(json))
    .then(objs => batchProcessor(objs))
    .catch(error => { throw error; });
};

module.exports = {
  assessor,
  batchAssessor
};