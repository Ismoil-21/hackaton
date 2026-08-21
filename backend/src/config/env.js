import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// .env ni har doim backend/ papkasidan o'qiydi — qaysi papkadan ishga tushirilganidan qat'i nazar.
// Render/Railway kabi platformalarda .env fayli bo'lmaydi, o'sha yerda haqiqiy env larga tushadi.
const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(backendRoot, '.env') });

export const env = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackathon_starter',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Prod da sozlanmasa bo'sh qoladi -> CORS hamma origin ga ruxsat beradi (ogohlantirish bilan)
  clientUrl:
    process.env.CLIENT_URL?.trim() ||
    (process.env.NODE_ENV === 'production'
      ? ''
      : 'http://localhost:5173,http://localhost:5174,http://localhost:4173,http://localhost:4174'),
  isProd: process.env.NODE_ENV === 'production',
};

if (env.isProd && env.jwtSecret === 'dev_secret_change_me')
  console.warn('⚠ JWT_SECRET sozlanmagan — productionda albatta o‘zgartiring!');
