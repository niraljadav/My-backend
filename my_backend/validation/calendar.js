const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateCalendarInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  // Title checks
  if (Validator.isEmpty(data.title)) {
    errors.title = "no title";
  }
  // desc checks
  if (Validator.isEmpty(data.description)) {
    errors.description = " ";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
