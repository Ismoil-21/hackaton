# Universal Hackathon Starter

React + Vite + Tailwind • Node + Express • MongoDB + Mongoose • JWT + bcrypt

Bitta universal `Request` modeli ustiga qurilgan to‘liq CRUD tizim: auth, rollar,
sidebar navigatsiya, qidiruv/filter, status boshqaruvi.
**Foydalanuvchi paneli va admin paneli — alohida portlarda ikkita mustaqil app**
(kod bazasi bitta). Yangi muammoga **bitta fayl**ni o‘zgartirib moslashadi.

---

## 1. Ishga tushirish

```bash
npm install        # hammasi birdan (npm workspaces)
npm run seed       # demo ma'lumot (ixtiyoriy)
npm run dev        # uchalasi birdan
```

| Port | Nima | Kim uchun |
|---|---|---|
| **5001** | Express API | ikkala panel ham shu API ga ulanadi |
| **5173** | Foydalanuvchi paneli | `user` (va admin ham kira oladi) |
| **5174** | Admin paneli | faqat `admin` — boshqasi 403 oladi |

Alohida ishga tushirish: `npm run dev:api` / `npm run dev:user` / `npm run dev:admin`

> Ikkala panel alohida origin (`:5173` va `:5174`) — ya'ni **sessiyalari ham alohida**.
> Bir vaqtda bitta oynada user, ikkinchisida admin bo'lib ishlash mumkin.

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
Backend `node --watch` da, frontend Vite HMR da — qayta ishga tushirish shart emas.

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
| `entity` | Sahifa sarlavhalari, tugmalar, toast xabarlari |
| `categories/statuses/priorities` | Mongoose enum, **sidebar bo'limlari**, filtr select lari, badge ranglari, statistika kartalari |
| `fields` | Forma inputlari + backend validatsiya + detail sahifadagi jadval |

`fields` type lari: `text` `textarea` `number` `date` `datetime` `select` `checkbox`
(`select` uchun `options: [{value,label}]`), qo‘shimcha: `required`, `min`, `placeholder`.

---

## 3. Struktura

```
Hackaton/
├── backend/                    Express + Mongoose API        :5001
│   └── src/
│       ├── config/{env,db}.js
│       ├── models/{User,Request}.js      Request enum lari domain dan
│       ├── middleware/{auth,error,validate}.js
│       ├── controllers/{auth,request,user}.controller.js
│       ├── routes/{auth,request,user}.routes.js
│       └── seed.js
│
├── shared/                     IKKALA PANEL ISHLATADIGAN KOD
│   ├── domain.js               ← 🔴 YAGONA SOZLASH NUQTASI
│   ├── styles.css
│   ├── lib/{api.js,utils.js}   axios + token + xato normalizatsiya
│   ├── context/{AuthContext,ToastContext}.jsx
│   ├── hooks/{useRequests,useAsync}.js   holat URL query da saqlanadi
│   ├── components/
│   │   ├── AppShell.jsx  Layout.jsx  Sidebar.jsx
│   │   ├── RequestsView.jsx     ← user va admin dashboard uchun umumiy yadro
│   │   ├── RequestForm.jsx      ← domain.fields dan dinamik forma
│   │   ├── RequestList.jsx  Filters.jsx  StatsCards.jsx  Pagination.jsx
│   │   └── ui/                  Button, Field, Modal, Badge, Card, States
│   └── pages/                   Login, Register, Dashboard, AdminDashboard,
│                                RequestDetail, Users, Forbidden, NotFound
│
├── user/                       Foydalanuvchi paneli          :5173
│   ├── index.html  vite.config.js  tailwind.config.js  package.json
│   └── src/{main.jsx, App.jsx, nav.js}     ← route lar + sidebar bo'limlari
│
└── admin/                      Admin paneli                  :5174
    └── (xuddi shunday, 4 ta fayl)
```

`user/` va `admin/` juda yupqa — har birida atigi 3 ta JS fayl (`main`, `App`, `nav`).
Barcha komponent, sahifa va logika `shared/` da, ya'ni **bir marta yozilgan, ikki joyda ishlaydi**.
`../shared` ga `@shared` alias orqali murojaat qilinadi (`vite.config.js`).

npm workspaces ishlatiladi: root da bitta `npm install` — `node_modules` ham bitta,
React nusxasi ham bitta.

### Sidebar bo'limlari

`user/src/nav.js` va `admin/src/nav.js` — bo'limlar shu yerda. Status havolalari
`domain.statuses` dan **avtomatik** yasaladi, ya'ni domain almashsa sidebar ham o'zi o'zgaradi.

```js
{ title: 'Tizim', items: [{ label: 'Foydalanuvchilar', to: '/users' }] }
{ label: 'Kutilmoqda', to: '/', params: { status: 'pending' }, tone: 'bg-amber-500' }
```

Filtr holati **URL query** da (`/?status=pending&search=...`) — shuning uchun
sidebar havolasi, statistika kartasi va select filtri bir xil holatni boshqaradi,
brauzerning "orqaga" tugmasi va havolani ulashish ham ishlaydi.

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

**Yangi sahifa qo‘shish** → `shared/pages/X.jsx` yarating, kerakli panelning
`user/src/App.jsx` yoki `admin/src/App.jsx` ga `<Route path="/x" element={<X />} />`
qo‘shing va o‘sha papkadagi `nav.js` ga sidebar havolasini yozing.

**Yangi API resurs** → `models/X.js` + `controllers/x.controller.js` +
`routes/x.routes.js` yarating, `routes/index.js` ga `router.use('/x', xRoutes)` qo‘shing.
`asyncHandler` va `ApiError` ni ishlating — xatolarni `errorHandler` o‘zi formatlaydi.

**Ro‘yxatga yangi ustun** → `shared/components/RequestList.jsx` (jadval + mobil karta).

**Statistikaga yangi ko‘rsatkich** → backend `request.controller.js` → `stats`,
frontend `shared/components/StatsCards.jsx`.

**Portni o‘zgartirish** → backend: `backend/.env` (`PORT`) + har ikkala
`vite.config.js` dagi proxy target. Frontend: `user/vite.config.js` va
`admin/vite.config.js` dagi `server.port`. Yangi portni `backend/.env` dagi
`CLIENT_URL` ga ham qo‘shing (vergul bilan).

---

## 6. Production / serverga yuklash

### Variant A — bitta server (eng oddiy, tavsiya etiladi)

```bash
npm install
npm run build      # -> user/dist  va  admin/dist
npm start          # backend :5001 hammasini tarqatadi
```

Backend build larni o'zi topib static qilib beradi:

| URL | Nima |
|---|---|
| `http://server:5001/` | foydalanuvchi paneli |
| `http://server:5001/admin` | admin paneli |
| `http://server:5001/api/...` | API |

Deep link lar (`/requests/123`, `/admin/users`) ham ishlaydi — SPA fallback qo'yilgan.
`.env` da faqat `MONGO_URI` va `JWT_SECRET` ni to'g'rilang. CORS kerak emas — bitta origin.

> Diqqat: bitta origin da user va admin **bitta sessiyani** baham ko'radi
> (localStorage origin ga bog'liq). Alohida sessiya kerak bo'lsa Variant B.

### Variant B — alohida hosting

`user/dist` va `admin/dist` ni alohida domen/portga qo'ying:

```bash
# user/.env va admin/.env
VITE_API_URL=https://api.domeningiz.uz/api
# backend/.env
CLIENT_URL=https://app.domeningiz.uz,https://admin.domeningiz.uz
```

`admin/vite.config.js` dagi `base` ni `'/'` ga o'zgartiring (alohida domen bo'lsa).
