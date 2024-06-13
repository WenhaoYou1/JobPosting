const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jobs = require("../models/Jobs");
const User = require("../models/User");

const router = express.Router();
const auth = require("../middleware/isAuth");

// create job
router.post("/", auth, async (req, res) => {
  const user = req.user[0];
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Fields are empty" });
  }
  try {
    const newJob = await Jobs.create({
      user: user._id,
      title,
      description,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get all posts

router.get("/", async (req, res) => {
  try {
    const jobs = await Jobs.find({ filled: false }).populate(
      "user",
      "-password"
    );

    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get only private user posts

router.get("/myads", auth, async (req, res) => {
  const user = req.user[0];
  try {
    const jobs = await Jobs.find({ user: user._id }).populate(
      "user",
      "-password"
    );
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get  global user posts

router.get("/publicuserads", async (req, res) => {
  const userID = req.query.id;
  try {
    const jobs = await Jobs.find({ user: userID }).populate(
      "user",
      "-password"
    );
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// get detailed job post

router.get("/details/:id", async (req, res) => {
  const postID = req.params.id;
  try {
    const jobs = await Jobs.findOne({ _id: postID }).populate(
      "user",
      "-password"
    );
    res.status(200).json({ success: true, jobs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// delete job post

router.delete("/delete/:id", auth, async (req, res) => {
  const postID = req.params.id;
  const user = req.user[0];

  try {
    const job = await Jobs.findOne({ _id: postID });

    if (!job) {
      return res.status(400).json({ success: false, message: "Wrong Post ID" });
    }
    if (job.user.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Job does not belong to User" });
    }
    const jobs = await Jobs.deleteOne({ _id: postID, user: user._id });
    res.status(200).json({ success: true, id: postID });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// update filled state

router.put("/:id/filled/:boolean", auth, async (req, res) => {
  const { id, boolean } = req.params;
  const user = req.user[0];
  try {
    const job = await Jobs.findOne({ _id: id });

    if (!job) {
      return res.status(400).json({ success: false, message: "Wrong Post ID" });
    }

    if (job.user.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Job does not belong to User" });
    }

    const jobs = await Jobs.updateOne(
      { _id: id },
      { $set: { filled: boolean } }
    );

    const updatedJob = await Jobs.findOne({ _id: id }).populate(
      "user",
      "-password"
    );
    res.status(200).json({ success: true, updatedJob });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// edit jobs

router.put("/:id/edit", auth, async (req, res) => {
  const user = req.user[0];
  const { title, description } = req.body;
  const { id } = req.params;
  let filledArgs = {};
  if (title) filledArgs.title = title;
  if (description) filledArgs.description = description;

  try {
    const job = await Jobs.findOne({ _id: id });

    if (!job) {
      return res.status(400).json({ success: false, message: "Wrong Post ID" });
    }

    if (job.user.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "Job does not belong to User" });
    }

    const jobs = await Jobs.updateOne({ _id: id }, { $set: filledArgs });

    const updatedJob = await Jobs.findOne({ _id: id });
    res.status(200).json({ success: true, updatedJob });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
