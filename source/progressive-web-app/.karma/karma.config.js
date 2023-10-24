// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),            
            require('karma-chrome-launcher'),
            require('karma-junit-reporter'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: { },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        junitReporter: {
            outputFile: require('path').join(__dirname, "../Reports/Results.xml"),
            suite: ''
        },
        coverageReporter: {
            dir: require('path').join(__dirname, '../Reports/Coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'lcov' },
                { type: 'cobertura' },
                { type: 'lcovonly' },
                { type: 'text' },
                { type: 'text-summary' }
            ],
            check: {
                global: {
                    statements: 50,
                    branches: 18,
                    functions: 48,
                    lines: 50
                }
            },
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml', 'junit', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: true
    });
};