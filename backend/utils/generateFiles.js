const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "../codes");
const dirOutput = path.join(__dirname, "../outputs");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}
const generateFile = async (format, code) => {
  const jobId = uuid();
  const filename = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, filename);
  await fs.writeFileSync(filePath, code);
  return filePath;
};

const generateInput = async (id, code) => {
  const filenae = `${id}.txt`;
  const filepath = path.join(dirOutput, filenae);
  await fs.writeFileSync(filepath, code);
  return filepath;
};
module.exports = {
  generateFile,
  generateInput,
};
