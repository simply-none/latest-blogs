const pkg = require("../package.json");

/**
 * 最小版本号数字终结的概率，比如0.1.3 => 0.1.4还是变成0.2.0
 * 3：40
 * 4：50
 * 5：60
 * 6：60
 * 7：70
 * 8：80
 * 9：80
 * 10：90
 * 11：90
 * 12：100
 */
function startNewVersion () {}

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
