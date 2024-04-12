const standardVersion = require("standard-version");
const pkg = require("../package.json");

// Options are the same as command line, except camelCase
// standardVersion returns a Promise
function generateVersion(version) {
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

function run(version) {
  let nextVersion = generateVersion(version);

  standardVersion({
    releaseAs: nextVersion,
    skip: {
      changelog: true,
      tag: false,
      commit: true,
    },
  })
    .then(() => {
      // standard-version is done
    })
    .catch((err) => {
      console.error(`standard-version failed with message: ${err.message}`);
    });
}

run(pkg.version);
