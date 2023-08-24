import {
  CLIENT_ID,
  CLIENT_SECRET,
  EMAIL_USER,
  PASS_USER,
  REFRESH_TOKEN,
} from '../../config/env';

export const transporter = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    //type: 'OAuth2',
    user: EMAIL_USER,
    pass: PASS_USER,
    // clientId: CLIENT_ID,
    // clientSecret: CLIENT_SECRET,
    // refreshToken: REFRESH_TOKEN,
  },
  //from: EMAIL_USER,
};
