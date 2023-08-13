import * as dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const DBDATABASE = process.env.DBDATABASE;
export const DBHOST = process.env.DBHOST;
export const DBPASSWORD = process.env.DBPASSWORD;
export const DBPORT = process.env.DBPORT;
export const DBUSERNAME = process.env.DBUSERNAME;
