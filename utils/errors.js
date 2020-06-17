const deliver = require('./deliver');

// Extend Javascript's Error class for our own purposes.
// We'll use this to supply humane error messages to the API client.
class APIError extends Error {
  constructor(type = "GENERAL", statusCode = 500, input, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, APIError);
    };

    this.code = "APIError";
    this.type = type;
    this.statusCode = statusCode;
    this.input = input

    this.report = {
      Error: {
        ErrorType: this.type,
        ErrorNote: this.message
      },
      Input: this.input
    };

    this.response = deliver.withStatus(this.statusCode, this.report);
  };
};

module.exports.APIError = APIError;

class APIBatchError extends APIError {
  constructor(...params) {
    super(...params);

    if (APIError.captureStackTrace) {
      APIError.captureStackTrace(this, APIBatchError);
    };

    this.code = "APIBatchError";

    this.report = {
      Error: {
        ErrorType: this.type,
        ErrorNote: this.message
      },
      Hints: this.input
    }

    this.response = deliver.withStatus(this.statusCode, this.report);
  }
}

module.exports.APIBatchError = APIBatchError;

// Check an error's type, then build the API response as appropriate.
// Use this in the catch section of try/catch blocks.
module.exports.respondWith = (error) => {
  // Log the error.
  //console.log(error, error.stack);

  // If the error runs deeper than we know, create a generic 500 response for the API client.
  let apiError = error;
  if (!(error instanceof APIError)) {
    apiError = new APIError("FATAL_ERROR", 500, null, "Internal Server Error.");
  }

  // Respond with the error.
  return apiError.response;
};