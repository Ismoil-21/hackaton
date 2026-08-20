/**
 * ============================================================================
 *  DOMAIN CONFIG  —  BUTUN TIZIMNING YAGONA SOZLASH NUQTASI
 * ============================================================================
 *  Yangi muammo berilganda FAQAT shu faylni o'zgartirasiz.
 *  Backend (validatsiya, model) va Frontend (UI, formalar, filtrlar)
 *  ikkalasi ham shu fayldan o'qiydi.
 *
 *  Tez moslashtirish (30 soniya):
 *    1) Pastdagi `presets` dan kerakligini tanlang
 *    2) Eng oxirdagi `export const domain = presets.XXX` qatorini o'zgartiring
 *    3) Kerak bo'lsa preset ichidagi status/category/fields ni tahrirlang
 *
 *  Field type lar: text | textarea | number | date | datetime | select | checkbox
 * ============================================================================
 */

/** Preset yasash uchun yordamchi — default qiymatlarni to'ldiradi */
const def = (cfg) => ({
  ...cfg,
  defaults: {
    category: cfg.categories[0].value,
    status: cfg.statuses[0].value,
    priority: cfg.priorities[1]?.value ?? cfg.priorities[0].value,
  },
});

/** Ranglar: badge uchun tailwind class lari (frontend ishlatadi) */
export const TONES = {
  gray: 'bg-slate-100 text-slate-700 ring-slate-200',
  blue: 'bg-blue-50 text-blue-700 ring-blue-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  purple: 'bg-purple-50 text-purple-700 ring-purple-200',
};

const PRIORITIES = [
  { value: 'low', label: 'Past', tone: 'gray' },
  { value: 'medium', label: "O'rta", tone: 'blue' },
  { value: 'high', label: 'Yuqori', tone: 'amber' },
  { value: 'urgent', label: 'Shoshilinch', tone: 'red' },
];

export const presets = {
  // ---------------------------------------------------------------- REQUEST
  request: def({
    key: 'request',
    entity: { one: 'Ariza', many: 'Arizalar', createLabel: 'Yangi ariza' },
    titleLabel: 'Sarlavha',
    descriptionLabel: 'Tavsif',
    categories: [
      { value: 'general', label: 'Umumiy' },
      { value: 'technical', label: 'Texnik' },
      { value: 'billing', label: "To'lov" },
      { value: 'other', label: 'Boshqa' },
    ],
    statuses: [
      { value: 'pending', label: 'Kutilmoqda', tone: 'amber' },
      { value: 'in_progress', label: 'Jarayonda', tone: 'blue' },
      { value: 'resolved', label: 'Hal qilindi', tone: 'green' },
      { value: 'rejected', label: 'Rad etildi', tone: 'red' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'contact', label: 'Aloqa (telefon/email)', type: 'text' },
      { key: 'location', label: 'Manzil', type: 'text' },
    ],
  }),

  // ---------------------------------------------------------------- BOOKING
  booking: def({
    key: 'booking',
    entity: { one: 'Bron', many: 'Bronlar', createLabel: 'Yangi bron' },
    titleLabel: 'Bron nomi',
    descriptionLabel: 'Izoh',
    categories: [
      { value: 'room', label: 'Xona' },
      { value: 'table', label: 'Stol' },
      { value: 'event', label: 'Tadbir' },
    ],
    statuses: [
      { value: 'pending', label: 'Tasdiqlanmagan', tone: 'amber' },
      { value: 'confirmed', label: 'Tasdiqlangan', tone: 'green' },
      { value: 'cancelled', label: 'Bekor qilingan', tone: 'red' },
      { value: 'completed', label: 'Yakunlangan', tone: 'gray' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'date', label: 'Sana', type: 'date', required: true },
      { key: 'time', label: 'Vaqt', type: 'text', placeholder: '19:00' },
      { key: 'guests', label: 'Odamlar soni', type: 'number', min: 1 },
      { key: 'phone', label: 'Telefon', type: 'text', required: true },
    ],
  }),

  // ------------------------------------------------------------------ ORDER
  order: def({
    key: 'order',
    entity: { one: 'Buyurtma', many: 'Buyurtmalar', createLabel: 'Yangi buyurtma' },
    titleLabel: 'Mahsulot',
    descriptionLabel: 'Buyurtma tafsiloti',
    categories: [
      { value: 'food', label: 'Ovqat' },
      { value: 'goods', label: 'Mahsulot' },
      { value: 'digital', label: 'Raqamli' },
    ],
    statuses: [
      { value: 'new', label: 'Yangi', tone: 'blue' },
      { value: 'paid', label: "To'landi", tone: 'purple' },
      { value: 'shipped', label: "Yo'lda", tone: 'amber' },
      { value: 'delivered', label: 'Yetkazildi', tone: 'green' },
      { value: 'cancelled', label: 'Bekor', tone: 'red' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'quantity', label: 'Soni', type: 'number', min: 1, required: true },
      { key: 'price', label: 'Narxi', type: 'number', min: 0 },
      { key: 'address', label: 'Yetkazish manzili', type: 'text', required: true },
      { key: 'paid', label: "To'langan", type: 'checkbox' },
    ],
  }),

  // -------------------------------------------------------------- COMPLAINT
  complaint: def({
    key: 'complaint',
    entity: { one: 'Shikoyat', many: 'Shikoyatlar', createLabel: 'Yangi shikoyat' },
    titleLabel: 'Shikoyat mavzusi',
    descriptionLabel: 'Batafsil',
    categories: [
      { value: 'service', label: 'Xizmat' },
      { value: 'product', label: 'Mahsulot' },
      { value: 'staff', label: 'Xodim' },
      { value: 'other', label: 'Boshqa' },
    ],
    statuses: [
      { value: 'open', label: 'Ochiq', tone: 'amber' },
      { value: 'reviewing', label: "Ko'rib chiqilmoqda", tone: 'blue' },
      { value: 'resolved', label: 'Hal qilindi', tone: 'green' },
      { value: 'closed', label: 'Yopildi', tone: 'gray' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'incidentDate', label: 'Sodir bo\'lgan sana', type: 'date' },
      { key: 'branch', label: 'Filial', type: 'text' },
    ],
  }),

  // ------------------------------------------------------------------- TASK
  task: def({
    key: 'task',
    entity: { one: 'Vazifa', many: 'Vazifalar', createLabel: 'Yangi vazifa' },
    titleLabel: 'Vazifa nomi',
    descriptionLabel: 'Tavsif',
    categories: [
      { value: 'dev', label: 'Development' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'ops', label: 'Operations' },
    ],
    statuses: [
      { value: 'todo', label: 'To do', tone: 'gray' },
      { value: 'in_progress', label: 'In progress', tone: 'blue' },
      { value: 'review', label: 'Review', tone: 'purple' },
      { value: 'done', label: 'Done', tone: 'green' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'dueDate', label: 'Muddat', type: 'date' },
      { key: 'estimate', label: 'Baho (soat)', type: 'number', min: 0 },
    ],
  }),

  // --------------------------------------------------------- JOB APPLICATION
  job: def({
    key: 'job',
    entity: { one: 'Nomzod arizasi', many: 'Arizalar', createLabel: 'Ariza topshirish' },
    titleLabel: 'Lavozim',
    descriptionLabel: 'Motivatsiya xati',
    categories: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'design', label: 'Design' },
      { value: 'sales', label: 'Sales' },
      { value: 'hr', label: 'HR' },
    ],
    statuses: [
      { value: 'applied', label: 'Topshirilgan', tone: 'blue' },
      { value: 'screening', label: 'Saralash', tone: 'amber' },
      { value: 'interview', label: 'Suhbat', tone: 'purple' },
      { value: 'offer', label: 'Taklif', tone: 'green' },
      { value: 'rejected', label: 'Rad etildi', tone: 'red' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'experience', label: 'Tajriba (yil)', type: 'number', min: 0, required: true },
      { key: 'resumeUrl', label: 'Rezyume havolasi', type: 'text' },
      { key: 'phone', label: 'Telefon', type: 'text', required: true },
    ],
  }),

  // -------------------------------------------------------- EMERGENCY REQUEST
  emergency: def({
    key: 'emergency',
    entity: { one: 'Favqulodda chaqiruv', many: 'Chaqiruvlar', createLabel: 'Chaqiruv yuborish' },
    titleLabel: 'Hodisa',
    descriptionLabel: 'Vaziyat tavsifi',
    categories: [
      { value: 'medical', label: 'Tibbiy' },
      { value: 'fire', label: "Yong'in" },
      { value: 'police', label: 'Militsiya' },
      { value: 'rescue', label: 'Qutqaruv' },
    ],
    statuses: [
      { value: 'received', label: 'Qabul qilindi', tone: 'amber' },
      { value: 'dispatched', label: "Yo'lga chiqdi", tone: 'blue' },
      { value: 'on_site', label: 'Joyida', tone: 'purple' },
      { value: 'closed', label: 'Yopildi', tone: 'green' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'address', label: 'Manzil', type: 'text', required: true },
      { key: 'phone', label: 'Telefon', type: 'text', required: true },
      { key: 'victims', label: 'Jabrlanganlar soni', type: 'number', min: 0 },
    ],
  }),

  // ----------------------------------------------------- EDUCATION ASSIGNMENT
  assignment: def({
    key: 'assignment',
    entity: { one: 'Topshiriq', many: 'Topshiriqlar', createLabel: 'Yangi topshiriq' },
    titleLabel: 'Topshiriq nomi',
    descriptionLabel: 'Shartlari',
    categories: [
      { value: 'math', label: 'Matematika' },
      { value: 'physics', label: 'Fizika' },
      { value: 'programming', label: 'Dasturlash' },
      { value: 'language', label: 'Til' },
    ],
    statuses: [
      { value: 'assigned', label: 'Berildi', tone: 'gray' },
      { value: 'submitted', label: 'Topshirildi', tone: 'blue' },
      { value: 'graded', label: 'Baholandi', tone: 'green' },
      { value: 'late', label: 'Kechikkan', tone: 'red' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'deadline', label: 'Deadline', type: 'date', required: true },
      { key: 'maxScore', label: 'Maksimal ball', type: 'number', min: 0 },
      { key: 'score', label: 'Olingan ball', type: 'number', min: 0 },
    ],
  }),

  // --------------------------------------------------------- SERVICE REQUEST
  service: def({
    key: 'service',
    entity: { one: 'Xizmat so\'rovi', many: 'So\'rovlar', createLabel: 'Xizmat chaqirish' },
    titleLabel: 'Xizmat turi',
    descriptionLabel: 'Muammo tavsifi',
    categories: [
      { value: 'plumbing', label: 'Santexnika' },
      { value: 'electric', label: 'Elektr' },
      { value: 'cleaning', label: 'Tozalash' },
      { value: 'it', label: 'IT' },
    ],
    statuses: [
      { value: 'requested', label: "So'ralgan", tone: 'amber' },
      { value: 'scheduled', label: 'Rejalashtirilgan', tone: 'blue' },
      { value: 'in_progress', label: 'Bajarilmoqda', tone: 'purple' },
      { value: 'done', label: 'Bajarildi', tone: 'green' },
      { value: 'cancelled', label: 'Bekor', tone: 'red' },
    ],
    priorities: PRIORITIES,
    fields: [
      { key: 'address', label: 'Manzil', type: 'text', required: true },
      { key: 'preferredDate', label: 'Qulay sana', type: 'date' },
      { key: 'phone', label: 'Telefon', type: 'text', required: true },
    ],
  }),
};

/* ============================================================================
 *  >>> SHU YERNI O'ZGARTIRING <<<
 *  presets.request | booking | order | complaint | task | job | emergency
 *                  | assignment | service
 * ========================================================================== */
export const domain = presets.request;

/** App nomi — navbar va login sahifada ko'rinadi */
export const APP_NAME = 'Hackathon Starter';

/* ---------------------------- yordamchi funksiyalar ---------------------- */
export const values = (list) => list.map((i) => i.value);
export const optionOf = (list, value) => list.find((i) => i.value === value);
export const labelOf = (list, value) => optionOf(list, value)?.label ?? value;
export const toneOf = (list, value) => TONES[optionOf(list, value)?.tone ?? 'gray'];

export const CATEGORY_VALUES = values(domain.categories);
export const STATUS_VALUES = values(domain.statuses);
export const PRIORITY_VALUES = values(domain.priorities);
