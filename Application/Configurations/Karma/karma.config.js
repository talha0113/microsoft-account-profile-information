// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
          require('karma-jasmine'),
          require('karma-jsdom-launcher'),
          require('karma-chrome-launcher'),
          require('karma-nunit2-reporter'),
          require('karma-jasmine-html-reporter'),
          require('karma-coverage'),
          require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      nunitReporter: {
          outputFile: require('path').join(__dirname, "../../Reports/Results.xml"),
          suite: ''
      },
      coverageReporter: {
          dir: require('path').join(__dirname, '../../Reports/Coverage'),
          reports: [
              'html',
              'lcov',
              'cobertura',
              'lcovonly',
              'text-summary'
          ],
          fixWebpackSourcePaths: true
      },
      reporters: ['progress', 'kjhtml', 'nunit', 'coverage'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadless'],
      singleRun: true
  });
};