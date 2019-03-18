const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load model
const Journal = require("../../models/Journal");
//Load User model
const User = require("../../models/User");
//Load Profile model
const Profile = require("../../models/Profile");

//Load Validation
const validateJournalInput = require("../../validation/journal");

//@route GET api/posts
//@desc GET posts
//@access Private
router.post("/", (req, res) => {
  Journal.find()
    .sort({ date: -1 })

    .then(journal => res.json(journal))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found." }));
});

// @route   GET api/journals/:id
// @desc    Get post by id
// @access  Private
router.post("/:id", (req, res) => {
  Journal.findById(req.params.id)

    .then(journal => res.json(journal))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

//@route GET api/Journal
//@desc  Create post in journal
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateJournalInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Get fields
    const journalFields = {};
    journalFields.user = req.user.id;
    if (req.body.title) journalFields.title = req.body.title;
    if (req.body.content) journalFields.content = req.body.content;

    Journal.findOne({ user: req.user.id }).then(journal => {
      if (journal) {
        //update
        Journal.findOneAndUpdate(
          { user: req.user.id },
          { $set: journalFields },
          { new: true }
        )
          .populate("user", ["name"])
          .then(journal => res.json(journal));
      } else {
        //create
        //save journal article
        new Journal(journalFields).save().then(journal => res.json(journal));
      }
    });
  }
);

//@route DELETE api/journal/:id
//@desc Delete post
//@access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Journal.findById(req.params.id)
        .then(journal => {
          // Check for post owner
          if (journal.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          journal.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

module.exports = router;
