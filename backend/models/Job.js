const mongoose = require("mongoose");
const JobSchema = mongoose.Schema({
  language: {
    type: String,
    requred: true,
    enum: ["cpp", "py"],
  },
  filePath: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    // expireAfterSeconds: 2,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  output: {
    type: String,
  },
  inputFile: {
    type: String,
  },
  status: {
    type: "String",
    default: "pending",
    enum: ["pending", "success", "failure"],
  },
});
const Job = new mongoose.model("job", JobSchema);
module.exports = Job;
