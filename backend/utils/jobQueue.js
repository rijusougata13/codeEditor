const Queue = require("bull");
const Job = require("../models/Job");
const { executeCpp } = require("../utils/execFileCpp");
const { executePy } = require("../utils/execFilePy");
const jobQueue = new Queue("job-queue");

const NUM_WORKERS = 5;
jobQueue.process(NUM_WORKERS, async ({ data }) => {
  console.log("data", data);
  const { id: jobId } = data;
  console.log("id", jobId);
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error("Job not found");
  }
  console.log("fetched job", job);
  try {
    let output;
    job["startedAt"] = new Date();

    if (job.language === "cpp") {
      output = await executeCpp(job.filePath);
    } else if (job.language === "py") {
      output = await executePy(job.filePath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
    console.log(job.filePath, output);
    // return res.json({ filePath, output });
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "failure";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(err);
    // return res.status(400).json({ err });
  }
  return true;
});

jobQueue.on("failed", (error) => {
  console.log(error.data.id, "failed", error.failedReason);
});

const addJobToQueue = async (jobId) => {
  // await jobQueue.add({ id: jobId });
  // console.log("data", data);
  // const { id: jobId } = data;
  console.log("id", jobId);
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error("Job not found");
  }
  console.log("fetched job", job);
  try {
    let output;
    job["startedAt"] = new Date();

    if (job.language === "cpp") {
      output = await executeCpp(job.filePath);
    } else if (job.language === "py") {
      output = await executePy(job.filePath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;
    await job.save();
    console.log(job.filePath, output);
    // return res.json({ filePath, output });
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "failure";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(err);
    // return res.status(400).json({ err });
  }
};

module.exports = {
  addJobToQueue,
};
