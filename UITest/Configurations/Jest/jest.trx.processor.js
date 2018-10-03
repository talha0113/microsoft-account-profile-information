var builder = require('jest-trx-results-processor');

var processor = builder({
    outputFile: './Reports/TestResults.trx'
});

module.exports = processor;
