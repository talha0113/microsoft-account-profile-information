var builder = require("jest-trx-results-processor/dist/testResultsProcessor");
var fs = require('fs');
if (!fs.existsSync("./Reports")) {
    fs.mkdirSync("./Reports");
}
var processor = builder({
    outputFile: './Reports/TestResults.trx'
});

module.exports = processor;
