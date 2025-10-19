# Unit Converter

A modern, responsive web application for converting measurements across multiple unit categories. Built with Next.js 15, React 19, and TypeScript, featuring instant multi-unit conversions with a clean, accessible interface optimized for mobile, tablet, and desktop devices.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## ✨ Features

### 🔄 Multiple Conversion Categories

- **Length** - Convert between metric and imperial distance measurements (mm, cm, m, km, in, ft, yd, mi)
- **Volume** - Convert between metric and US liquid measurements (mL, L, fl oz, cup, pt, qt, gal)
- **Weight** - Convert between metric and imperial mass measurements (g, kg, t, oz, lb, ton, st)
- **Temperature** - Convert between common temperature scales (°C, °F, K)
- **Time** - Convert between Unix epoch timestamps and human-readable datetime formats

### 🎯 User Experience

- **Instant Results** - Real-time conversions without page reloads
- **Multi-Unit Display** - See conversions to all available units at once
- **Smart Formatting** - Results formatted to 2 decimal places, with intelligent handling of whole numbers
- **Responsive Design** - Seamless experience across mobile, tablet, and desktop devices
- **Dark Mode Support** - Toggle between light and dark themes with OKLCH color space
- **Accessible** - WCAG 2.1 Level AA compliant with keyboard navigation and screen reader support

### 🛠️ Technical Highlights

- **Type-Safe** - Full TypeScript strict mode with comprehensive type definitions
- **Modern React** - Utilizes React Server Components (RSC) for optimal performance
- **Form Validation** - Client-side validation with React Hook Form and Zod schemas
- **Component Library** - shadcn/ui components (New York style) for consistent design
- **Optimized Fonts** - Geist Sans and Geist Mono with next/font optimization

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rhoofr/unit-converter.git
cd unit-converter
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📦 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Deploy to GitHub Pages

This project is configured for deployment to GitHub Pages. The application will be available at your GitHub Pages URL.

## 🏗️ Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx             # Root layout with fonts and metadata
│   ├── page.tsx               # Homepage
│   └── globals.css            # Global styles and theme variables
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── category-tabs.tsx      # Main category selector
│   ├── unit-converter-form.tsx
│   ├── time-converter-form.tsx
│   └── ...                    # Other custom components
└── lib/
    ├── utils.ts               # Utility functions
    └── conversions/           # Conversion logic by category
        ├── length.ts
        ├── volume.ts
        ├── weight.ts
        ├── temperature.ts
        └── time.ts
```

## 🧮 Conversion Logic

Each category uses a base unit for internal calculations:

- **Length**: Meter (m)
- **Volume**: Liter (L)
- **Weight**: Kilogram (kg)
- **Temperature**: Direct formulas (no base unit)
- **Time**: Unix Epoch Seconds

**Conversion Process:**

1. Convert input value to base unit using `toBase()`
2. Convert base unit to all target units using `fromBase()`
3. Format results with smart precision (2 decimals or whole numbers)
4. Display in responsive grid layout

## 🎨 Tech Stack

| Technology                                                | Purpose                            |
| --------------------------------------------------------- | ---------------------------------- |
| [Next.js 15](https://nextjs.org/)                         | React framework with App Router    |
| [React 19](https://react.dev/)                            | UI library with Server Components  |
| [TypeScript 5](https://www.typescriptlang.org/)           | Type-safe development              |
| [Tailwind CSS v4](https://tailwindcss.com/)               | Utility-first styling              |
| [shadcn/ui](https://ui.shadcn.com/)                       | Component library (New York style) |
| [React Hook Form](https://react-hook-form.com/)           | Form state management              |
| [Zod](https://zod.dev/)                                   | Schema validation                  |
| [Lucide React](https://lucide.dev/)                       | Icon library                       |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme management                   |

## 🧪 Code Quality

```bash
npm run lint          # Run ESLint checks
npm run build         # Validates types and linting
```

**Configuration:**

- ESLint flat config with Next.js core-web-vitals + TypeScript rules
- Strict TypeScript mode enabled
- Path aliases configured (`@/*` → `./src/*`)

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**@rhoofr**

## 🚫 Contributing

This is a personal project and is **not accepting pull requests** at this time. Feel free to fork the repository for your own use under the terms of the MIT License.

## 📝 Version

**Current Version:** 0.1.0  
**Last Updated:** October 18, 2025

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts: [Geist](https://vercel.com/font) by Vercel

---

**Made with ❤️ using Next.js, React, and TypeScript**
