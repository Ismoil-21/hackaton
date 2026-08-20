/**
 * Demo ma'lumot: `npm run seed`
 * Domain o'zgarsa ham ishlaydi — status/category/priority config dan olinadi.
 */
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Request } from './models/Request.js';
import { domain, CATEGORY_VALUES, STATUS_VALUES, PRIORITY_VALUES } from '../../shared/domain.js';

const pick = (arr, i) => arr[i % arr.length];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Request.deleteMany({})]);

  const admin = await User.create({ name: 'Admin', email: 'admin@demo.uz', password: 'admin123', role: 'admin' });
  const users = await User.create([
    { name: 'Ali Valiyev', email: 'ali@demo.uz', password: 'user123' },
    { name: 'Nodira Karimova', email: 'nodira@demo.uz', password: 'user123' },
  ]);

  const metaSample = Object.fromEntries(
    domain.fields.map((f) => [
      f.key,
      f.type === 'number' ? 2 : f.type === 'checkbox' ? false : f.type === 'date' ? '2026-09-01' : 'Demo',
    ])
  );

  const docs = Array.from({ length: 14 }, (_, i) => ({
    title: `${domain.entity.one} #${i + 1}`,
    description: `Demo tavsif — ${domain.entity.one.toLowerCase()} namunasi ${i + 1}.`,
    category: pick(CATEGORY_VALUES, i),
    status: pick(STATUS_VALUES, i),
    priority: pick(PRIORITY_VALUES, i),
    userId: pick([...users, admin], i)._id,
    assignedTo: i % 3 === 0 ? admin._id : null,
    metadata: metaSample,
  }));
  await Request.insertMany(docs);

  console.log(`✓ Seed tayyor: ${docs.length} ta ${domain.entity.many.toLowerCase()}`);
  console.log('  admin@demo.uz / admin123   |   ali@demo.uz / user123');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
