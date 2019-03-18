const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateExpenseInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.description = !isEmpty(data.description) ? data.description : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";
  data.month = !isEmpty(data.month) ? data.month : "";

  // desc checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "Enter description";
  }
  // amount checks
  if (Validator.isEmpty(data.amount)) {
    errors.amount = "Enter amount";
  }
  // month
  if (Validator.isEmpty(data.month)) {
    errors.month = "Enter month";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
