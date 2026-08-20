import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => console.log(`✓ API: http://localhost:${env.port}/api`));
  } catch (err) {
    console.error('✗ Ishga tushmadi:', err.message);
    process.exit(1);
  }
}
start();
