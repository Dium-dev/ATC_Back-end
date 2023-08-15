import nodemailer = require('nodemailer');
import * as dotenv from 'dotenv';

dotenv.config();
const { CLIENT_ID, CLIENT_SECRET, EMAIL_USER, REFRESH_TOKEN } = process.env;

const transporter = nodemailer.createTransport({
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
});