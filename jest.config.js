const tsconfig = require("./tsconfig.json")
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig)

module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./src",
  testRegex: "src\/.*spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "typescript-babel-jest"
  },
  moduleNameMapper,
  coverageDirectory: "../coverage"
}
