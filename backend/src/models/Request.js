import mongoose from 'mongoose';
import { domain, CATEGORY_VALUES, STATUS_VALUES, PRIORITY_VALUES } from '../../../shared/domain.js';

/**
 * UNIVERSAL model.
 * Enum lar shared/domain.js dan keladi — domain o'zgarsa model avtomatik moslashadi.
 * Domenga xos qo'shimcha maydonlar `metadata` ichida (domain.fields orqali).
 */
const requestSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Sarlavha majburiy'], trim: true, maxlength: 140 },
    description: { type: String, default: '', trim: true, maxlength: 5000 },
    category: { type: String, enum: CATEGORY_VALUES, default: domain.defaults.category, index: true },
    status: { type: String, enum: STATUS_VALUES, default: domain.defaults.status, index: true },
    priority: { type: String, enum: PRIORITY_VALUES, default: domain.defaults.priority, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// search: title + description bo'yicha
requestSchema.index({ title: 'text', description: 'text' });

requestSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Request = mongoose.model('Request', requestSchema);
