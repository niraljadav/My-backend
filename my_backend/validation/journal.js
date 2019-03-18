const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateJournalInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";
  data.content = !isEmpty(data.content) ? data.content : "";
  // Title checks
  if (Validator.isEmpty(data.title)) {
    errors.title = "no title";
  }
  // desc checks
  if (Validator.isEmpty(data.content)) {
    errors.content = " ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
