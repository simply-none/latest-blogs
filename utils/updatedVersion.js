const generateVersion = require("./utils").generateVersion
const fs = require("fs");

function updatedVersion(version) {
  let newVersion = generateVersion(version);
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const packageLockJson = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));

  packageJson.version = newVersion;
  packageLockJson.version = newVersion;
  packageLockJson.packages[""].version = newVersion;

  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + '\n');
  fs.writeFileSync("package-lock.json", JSON.stringify(packageLockJson, null, 2) + '\n');

}

module.exports = {
  updatedVersion,
};
