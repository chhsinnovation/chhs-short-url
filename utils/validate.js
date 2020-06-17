const errors = require('./errors');

/*  
  The essentials. 
    A validator should accept an event's body parameter (as supplied to a serverless function).
    A validator should then process that event's body in some way, to validate it.
    A validator should then do one of two things:
      1. If valid, return the original event's body.
      2. If invalid, throw an error.
    A validator should take care to throw a relevant error that an API user can understand.
*/

// Generate a validator to check for the presence of a parameter within an event's body.
const presence = (object, parameter) => {
  if (object.hasOwnProperty(parameter) && object[parameter]) {
    return object;
  } else {
    const errorTemplate = `The *${parameter}* parameter is missing.`;
    throw new errors.APIError("MISSING_PARAMETER", 400, object, errorTemplate);
  };
};

const url = (object, parameter) => {
  try {
    const u = new URL(object[parameter]);
    if (u) {
      return object;
    }
  } catch (error) {
    throw new errors.APIError( "MALFORMED_PARAMETER", 400, object, `Not a valid URL.`);
  };
};

module.exports = {
  presence,
  url
}