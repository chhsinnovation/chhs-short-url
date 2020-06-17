/*  
  The essentials. 
    A formatter should accept an object.
    A formatter should then process that object in some way, to format it.
    A formatter should then return the modified object, in full.
*/

const json = (object) => {
  return JSON.parse(object);
}

module.exports = {
  json
}