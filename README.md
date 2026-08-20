# Universal Hackathon Starter

React + Vite + Tailwind • Node + Express • MongoDB + Mongoose • JWT + bcrypt

Bitta universal `Request` modeli ustiga qurilgan to‘liq CRUD tizim: auth, rollar,
dashboard, qidiruv/filter, status boshqaruvi. Yangi muammoga **bitta fayl**ni
o‘zgartirib moslashadi.

---

## 1. Ishga tushirish

```bash
npm run setup      # backend + frontend dependency
npm run seed       # demo ma'lumot (ixtiyoriy)
npm run dev        # API :5001 + Web :5173
```

MongoDB lokal ishlab turishi kerak: `brew services start mongodb-community`

Demo hisoblar (seed dan keyin):

| Email | Parol | Rol |
|---|---|---|
| admin@demo.uz | admin123 | admin |
| ali@demo.uz | user123 | user |

> Birinchi ro‘yxatdan o‘tgan foydalanuvchi avtomatik **admin** bo‘ladi.

---

## 2. ⚡ Yangi domenga moslashtirish (1–5 daqiqa)

Butun tizim **`shared/domain.js`** dan boshqariladi. Backend validatsiya/enum lar
va frontend UI (formalar, filtrlar, badge lar, statistika) — hammasi shu fayldan o‘qiydi.

### Variant A — tayyor preset (30 soniya)

`shared/domain.js` ning eng oxiridagi qatorni o‘zgartiring:

```js
export const domain = presets.booking;   // request | booking | order | complaint
                                         // task | job | emergency | assignment | service
```

Keyin `npm run seed` (eski ma'lumot eski enum larga ega bo‘lgani uchun) — tayyor.

### Variant B — o‘z domeningiz (2–5 daqiqa)

`presets` ichiga yangi blok qo‘shing:

```js
myDomain: def({
  key: 'myDomain',
  entity: { one: 'Chipta', many: 'Chiptalar', createLabel: 'Chipta olish' },
  titleLabel: 'Yo‘nalish',
  descriptionLabel: 'Izoh',
  categories: [{ value: 'bus', label: 'Avtobus' }, { value: 'train', label: 'Poyezd' }],
  statuses:   [{ value: 'booked', label: 'Band qilindi', tone: 'blue' },
               { value: 'used',   label: 'Ishlatilgan',  tone: 'green' }],
  priorities: PRIORITIES,
  fields: [                                  // <- metadata ichiga tushadi
    { key: 'seat', label: 'O‘rindiq', type: 'number', min: 1, required: true },
    { key: 'departAt', label: 'Jo‘nash sanasi', type: 'date', required: true },
  ],
}),
```

va pastda `export const domain = presets.myDomain;`

**Nima avtomatik o‘zgaradi:**

| O‘zgarish | Ta’siri |
|---|---|
| `entity` | Sahifa sarlavhalari, tugmalar, toast xabarlari, navbar |
| `categories/statuses/priorities` | Mongoose enum, filtr select lari, badge ranglari, statistika kartalari |
| `fields` | Forma inputlari + backend validatsiya + detail sahifadagi jadval |

`fields` type lari: `text` `textarea` `number` `date` `datetime` `select` `checkbox`
(`select` uchun `options: [{value,label}]`), qo‘shimcha: `required`, `min`, `placeholder`.

---

## 3. Struktura

```
shared/domain.js          ← 🔴 YAGONA SOZLASH NUQTASI

backend/src/
  config/{env,db}.js
  models/{User,Request}.js       Request enum lari domain dan
  middleware/{auth,error,validate}.js
  controllers/{auth,request,user}.controller.js
  routes/{auth,request,user}.routes.js
  seed.js

frontend/src/
  config/domain.js               shared ni re-export qiladi
  lib/api.js                     axios + token + xato normalizatsiya
  context/{AuthContext,ToastContext}.jsx
  hooks/{useRequests,useAsync}.js
  components/
    RequestsView.jsx             ← user va admin dashboard uchun umumiy yadro
    RequestForm.jsx              ← domain.fields dan dinamik forma
    RequestList.jsx  Filters.jsx  StatsCards.jsx  Pagination.jsx
    ui/                          Button, Field, Modal, Badge, Card, States
  pages/                         Login, Register, Dashboard, AdminDashboard,
                                 RequestDetail, Users, NotFound
```

---

## 4. API

Barcha javoblar: `{ success, data|message, meta?, errors? }`

| Method | Endpoint | Kim |
|---|---|---|
| POST | `/api/auth/register` | hamma |
| POST | `/api/auth/login` | hamma |
| POST | `/api/auth/logout` | auth |
| GET | `/api/auth/me` | auth |
| GET | `/api/requests` | auth — user faqat o‘zinikini ko‘radi |
| GET | `/api/requests/stats` | auth |
| POST | `/api/requests` | auth |
| GET/PATCH/DELETE | `/api/requests/:id` | egasi yoki admin |
| GET/PATCH/DELETE | `/api/users/:id?` | faqat admin |

`GET /api/requests` query: `search` `category` `status` `priority` `assignedTo`
`mine=true` `page` `limit` `sortBy` `order`

Ruxsatlar:
- **user** — o‘z yozuvini yaratadi/tahrirlaydi/o‘chiradi (`status`, `assignedTo` ga tegolmaydi)
- **admin** — hamma yozuvni ko‘radi, status/mas'ul tayinlaydi, foydalanuvchilarni boshqaradi

---

## 5. Tez-tez kerak bo‘ladigan o‘zgartirishlar

**Yangi sahifa qo‘shish** → `frontend/src/pages/X.jsx` yarating, `App.jsx` ga
`<Route path="/x" element={<X />} />` qo‘shing (kerak bo‘lsa `<ProtectedRoute roles={['admin']}>` ichiga).

**Yangi API resurs** → `models/X.js` + `controllers/x.controller.js` +
`routes/x.routes.js` yarating, `routes/index.js` ga `router.use('/x', xRoutes)` qo‘shing.
`asyncHandler` va `ApiError` ni ishlating — xatolarni `errorHandler` o‘zi formatlaydi.

**Ro‘yxatga yangi ustun** → `components/RequestList.jsx` (jadval + mobil karta).

**Statistikaga yangi ko‘rsatkich** → backend `request.controller.js` → `stats`,
frontend `components/StatsCards.jsx`.

**Portni o‘zgartirish** → `backend/.env` (`PORT`) va `frontend/vite.config.js` (proxy target).

---

## 6. Production build

```bash
npm run build            # frontend/dist
cd backend && npm start  # NODE_ENV=production
```

`frontend/.env` da `VITE_API_URL=https://api.domeningiz.uz/api` ni bering,
`backend/.env` da `CLIENT_URL` ga frontend manzilini yozing (vergul bilan bir nechta bo‘lishi mumkin).
