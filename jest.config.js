// set environment variables to test.env
// will use db name with testsdb suffix
require('dotenv').config({
    path: 'test.env'
});


module.exports = {
    testEnvironment: 'node',
    setupFiles: ["dotenv/config"]
}

/**
 * 
 * https://nodemailer.com/about/
 * https://nodemailer.com/smtp/testing/
 * https://ethereal.email/
 * 
 * additional tests to build
 * https://gist.github.com/andrewjmead/988d5965c609a641202600b073e54266
 * 
 */