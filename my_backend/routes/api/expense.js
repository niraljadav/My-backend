const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateExpenseInput = require("../../validation/expense");

//Load expense model
const Expense = require("../../models/Expense");
//Load User model
const User = require("../../models/User");
//Load Profile model
const Profile = require("../../models/Profile");

//@route GET api/expense
//@desc  GET cuurent users planner
//@access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Expense.findOne({ user: req.user.id }).then(expense => {
      if (!expense) {
        errors.noexpense = "There is no planner created by user.";
        return res.status(404).json(errors);
      }
      res.json(expense);
    });
  }
);

//@route GET api/expense
//@desc  Create expense planner
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExpenseInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Get fields
    const expenseFields = {};
    expenseFields.user = req.user.id;
    if (req.body.description) expenseFields.description = req.body.description;
    if (req.body.amount) expenseFields.amount = req.body.amount;
    if (req.body.month) expenseFields.month = req.body.month;

    Expense.findOne({ user: req.user.id }).then(expense => {
      if (expense) {
        //update
        Expense.findOneAndUpdate(
          { user: req.user.id },
          { $set: expenseFields },
          { new: true }
        )
          .populate("user", ["name"])
          .then(expense => res.json(expense));
      } else {
        //create
        //save planner
        new Expense(expenseFields).save().then(expense => res.json(expense));
      }
    });
  }
);

// @route   DELETE api/expense/:id
// @desc    Delete planner
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Expense.findById(req.params.id)
        .then(expense => {
          // Check for post owner
          if (expense.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          expense.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ enentnotfound: "No planner found" })
        );
    });
  }
);

module.exports = router;
