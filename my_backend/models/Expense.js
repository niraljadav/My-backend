const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ExpenseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  description: {
    type: String
  },
  amount: {
    type: Number
  },
  month: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  year: {
    type: Number
  }
});
module.exports = Expense = mongoose.model("Expense", ExpenseSchema);
