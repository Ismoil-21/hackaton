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

## 6. Deploy — Vercel (2 ta panel) + Render (API)

Loyihada 3 ta mustaqil deploy bo'ladi:

| Nima | Qayerda | Manzil |
|---|---|---|
| API | Render | `https://<render-app>.onrender.com` |
| Foydalanuvchi paneli | Vercel | https://user-khaki-phi.vercel.app |
| Admin paneli | Vercel | https://admin-woad-tau-34.vercel.app |

### 6.1 Render — backend

**Settings:**

| Maydon | Qiymat |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

**Environment Variables:**

```
NODE_ENV      = production
MONGO_URI     = mongodb+srv://...   (MongoDB Atlas)
JWT_SECRET    = <uzun tasodifiy satr>
CLIENT_URL    = https://user-khaki-phi.vercel.app,https://admin-woad-tau-34.vercel.app,https://*.vercel.app
```

> `PORT` ni **qo'lda qo'ymang** — Render o'zi beradi, kod uni o'qiydi.
> `https://*.vercel.app` — preview deploy lar uchun; xohlasangiz olib tashlang.

MongoDB Atlas → Network Access → `0.0.0.0/0` ga ruxsat bering (Render IP lari o'zgaruvchan).

### 6.2 Vercel — ikkala panel uchun ham

Har bir panel uchun **alohida Vercel loyihasi**, ikkalasi ham shu bitta repodan.

| Maydon | user loyihasi | admin loyihasi |
|---|---|---|
| Root Directory | **`./`** (repo ildizi, o'zgartirmang) | **`./`** |
| Framework Preset | Vite | Vite |
| Build Command | `npm run build:user` | `npm run build:admin` |
| Output Directory | `user/dist` | `admin/dist` |
| Install Command | `npm install` | `npm install` |

**Environment Variables** (ikkalasida ham bir xil):

```
VITE_API_URL = https://<render-app>.onrender.com/api
```

> ⚠️ Root Directory ni `user` yoki `admin` qilib qo'ymang — u holda `shared/` papkasi
> build ga tushmaydi va `Rollup failed to resolve import` xatosi chiqadi.
>
> ⚠️ `VITE_API_URL` **build vaqtida** kodga yoziladi. Env ni qo'shgandan keyin
> albatta **Redeploy** qiling, aks holda eski qiymat qoladi.
>
> Repo ildizidagi `vercel.json` SPA rewrite ni beradi — `/login`, `/users`,
> `/requests/123` kabi manzillar to'g'ridan-to'g'ri ochilganda 404 bo'lmaydi.

### 6.3 Deploydan keyin tekshirish

```bash
curl https://<render-app>.onrender.com/api/health
# {"success":true,"status":"ok",...}
```

Keyin panelni oching → login. Xatolik chiqsa:

| Belgi | Sabab |
|---|---|
| `Serverga ulanib bo'lmadi...` | `VITE_API_URL` noto'g'ri yoki redeploy qilinmagan |
| Konsolda `CORS policy` | Render dagi `CLIENT_URL` ga o'sha domen qo'shilmagan |
| Sahifa yangilanganda 404 | `vercel.json` repo ildizida yo'q yoki Root Directory noto'g'ri |
| `Rollup failed to resolve import` | Vercel Root Directory `./` emas |
| Birinchi so'rov ~50s | Render bepul tarifi uyqudan uyg'onmoqda (normal) |

Demo hisoblarni yaratish uchun bir marta lokalda `MONGO_URI` ni Atlas ga qaratib
`npm run seed` ishga tushiring — yoki panelda ro'yxatdan o'ting
(**birinchi foydalanuvchi avtomatik admin bo'ladi**).

### 6.4 Muqobil — hammasi bitta serverda

Vercel ishlatmasdan, faqat bitta VPS/Render service da:

```bash
npm install
npm run build:server     # admin ni /admin ostiga moslab build qiladi
npm start
```

| URL | Nima |
|---|---|
| `/` | foydalanuvchi paneli |
| `/admin` | admin paneli |
| `/api/...` | API |

Bu holda CORS umuman kerak emas (bitta origin), lekin user va admin
**bitta sessiyani** baham ko'radi.
