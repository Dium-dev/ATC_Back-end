import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const DBDATABASE = process.env.DBDATABASE;
export const DBHOST = process.env.DBHOST;
export const DBPASSWORD = process.env.DBPASSWORD;
export const DBPORT = process.env.DBPORT;
export const DBUSERNAME = process.env.DBUSERNAME;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
export const EMAIL_USER = process.env.EMAIL_USER;
export const PASS_USER = process.env.PASS_USER;
