# Javis Frontend

Javis Frontend adalah aplikasi web modern yang dibangun dengan Next.js 16, React 19, dan TypeScript. Aplikasi ini dirancang untuk memberikan pengalaman pengguna yang responsif dan interaktif dengan menggunakan Tailwind CSS untuk styling dan Axios untuk komunikasi API.

## 🚀 Fitur Utama

- **Next.js 16** dengan App Router untuk routing yang efisien
- **React 19** dengan TypeScript untuk type safety
- **Tailwind CSS v4** untuk styling yang modern dan konsisten
- **Axios** untuk HTTP client yang powerful
- **Tabler Icons** untuk icon library yang lengkap

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.2 | React framework dan SSR/SSG |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.2.2 | Styling framework |
| Axios | 1.14.0 | HTTP client |
| Tabler Icons | 3.41.1 | Icon library |

## 📋 Prerequisites

- Node.js 18 atau yang lebih baru
- npm, yarn, pnpm, atau bun
- Git untuk version control

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/indogegewepe/javis-fe.git
cd javis-fe
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
```

### 3. Konfigurasi Environment

Salin file `.env.example` ke `.env.local` dan sesuaikan konfigurasi:

```bash
cp .env.example .env.local
```

Edit file `.env.local` untuk mengatur API endpoint:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Jalankan Aplikasi

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
javis-fe/
├── app/                 # Next.js App Router
│   ├── page.tsx        # Halaman utama
│   └── (routes)        # Routing pages
├── components/          # React components
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/             # Global styles
├── .env.example        # Environment template
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## ⚙️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Jalankan development server dengan hot reload |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint untuk code linting |

Dibuat dengan ❤️ menggunakan Next.js dan React
