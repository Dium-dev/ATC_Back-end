import nodemailer = require('nodemailer');

import {
  CLIENT_ID,
  CLIENT_SECRET,
  EMAIL_USER,
  REFRESH_TOKEN,
} from '../../config/env';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    type: 'OAuth2',
    user: EMAIL_USER,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  },
  from: EMAIL_USER,
});
transporter
  .verify()
  .then(() => {
    console.log('Server is ready to take our messages');
  })
  .catch((error) => console.log(error));
