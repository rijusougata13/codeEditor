const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const fkill = require("fkill");

const outputPath = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  console.log("output", outPath);
  return new Promise(async (resolve, reject) => {
    // const time = new Date().getSeconds();
    // while (new Date().getSeconds() < time + 10) {
    // console.log(new Date().getMinutes(), time);
    let flg = true;

     await exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${jobId}.txt`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ stderr });
        } else if (stderr) {
          reject({ stderr });
        } else {
          flg = false;
          resolve(stdout);
        }
      }
    );
    setTimeout(async () => {
      if (flg) fkill(`${jobId}.out`);
      exec(
        `rm ${filePath} && cd ${outputPath} && rm ${outPath} && rm ${jobId}.txt`
      );
    }, 9000);
  });
};

module.exports = {
  executeCpp,
};
