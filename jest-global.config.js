const tsconfig = require("./tsconfig.json")
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig)

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: ".*spec.ts$",
  moduleNameMapper,
  transform: {
    "^.+\\.(t|j)s$": "typescript-babel-jest"
  },
  coverageDirectory: "./coverage"
}
