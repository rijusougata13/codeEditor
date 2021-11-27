const express = require("express");
const mongoose = require("mongoose");
const { generateFile, generateInput } = require("./utils/generateFiles");
const path = require("path");
const cors = require("cors");
const Job = require("./models/Job");
const { jobQueue, addJobToQueue } = require("./utils/jobQueue");

mongoose.connect(
  "mongodb://localhost/compiler2",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log("successfuly connected");
  }
);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/allJob", async (req, res) => {
  try {
    const job = await Job.find();
    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
    });
  }
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  if (jobId == undefined) {
    return res.status(400).json({
      success: "false",
      error: "missing id query",
    });
  }
  try {
    const job = await Job.findById(jobId);
    if (job == undefined) {
      return res.status(404).json({
        success: false,
        error: "Invalid job id",
      });
    }
    return res.status(200).json({ success: true, job });
  } catch (err) {
    return res.status(400).json({
      success: "false",
      error: JSON.stringify(err),
    });
  }
});
app.post("/run", async (req, res) => {
  const { language = "cpp", code, textInput } = req.body;

  if (code === undefined) {
    return res.status(400).json({
      success: false,
      error: "empty code",
    });
  }
  let job;
  try {
    console.log(language);
    const filePath = await generateFile(language, code);

    const id = path.basename(filePath).split(".")[0];
    const inputPath = await generateInput(id, textInput);
    job = await new Job({ language, filePath, inputFile: inputPath }).save();
    const jobId = job["_id"];
    addJobToQueue(jobId);
    res.status(201).json({ success: true, jobId });
    let output;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
});
app.listen(5000, () => {
  console.log(`listening on 5000`);
});
