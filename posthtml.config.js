const { getPosthtmlBemLinter } = require("posthtml-bem-linter");
const { getPosthtmlW3cValidator } = require("posthtml-w3c-validator");
const minifyHtml = require("htmlnano");

const getSourceName = (filename) =>
  filename.replace(/^.*pages(\\+|\/+)(.*)\.twig$/, "$2").replace(/\\/g, "/");

module.exports = {
  plugins: [
    getPosthtmlW3cValidator({
      forceOffline: true,
      getSourceName,
    }),
    getPosthtmlBemLinter({
      getSourceName,
    }),
    minifyHtml({ collapseWhitespace: "aggressive" }),
  ],
};
