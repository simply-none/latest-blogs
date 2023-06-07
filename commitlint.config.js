module.exports = { 
  extends: ["@commitlint/config-conventional"],
  parserPreset: "conventional-changelog-atom",
  formatter: "@commitlint/format",
  rules: {
    "type-enum": [2, "always", ["foo"]]
  },
  ignores: [
    commit => commit === 'jousindea'
  ],
  defaultIgnores: true,
  prompt: {
    message: {},
    questions: {
      type: {
        description: "please input type:"
      }
    }
  }
};
