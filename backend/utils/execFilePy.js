const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executePy = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  return new Promise((resolve, reject) => {
    exec(
      `python ${filePath} < outputs/${jobId}.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ stderr });
        }
        if (stderr) {
          reject({ stderr });
        }
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
