const pkg = require("../package.json");

function generateVersion(version = pkg.version) {
  let maxTag = 9
  let versionA = version.split(".");
  let [major, minor, patch] = versionA;
  if (Number(patch) !== maxTag) {
    patch = parseInt(patch) + 1;
    return `${major}.${minor}.${patch}`;
  }
  if (Number(patch) === maxTag) {
    patch = "0";
    minor = parseInt(minor) + 1;
  }
  if ((Number(patch) === 0 && Number(minor) === (maxTag + 1)) || Number(minor) === maxTag) {
    minor = "0";
    major = parseInt(major) + 1;
  }
  return `${major}.${minor}.${patch}`;
}

module.exports = {
  generateVersion,
};
