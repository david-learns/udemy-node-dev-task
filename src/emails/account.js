'use strict';

require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.dev.train@gmail.com',
        subject: 'Welcome to Task-MGMT app!',
        text: `Hello ${name}. Thanks for choosing the Task-MGMT app. Please let us know how we did after having a chance to use the app.`
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'david.dev.train@gmail.com',
        subject: 'Cancellation Request Received',
        text: `
        Hello ${name},
        We regret to inform you per the acknowledged and accepted terms and conditions of your account you are unable to cancel. You are bound to us for life. You cannot leave. You cannot quit. You cannot hide.
        [que: The Police: Every Breath You Take]
        
        
        JK
        ;)
        your account has been removed from our system.`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail,
}