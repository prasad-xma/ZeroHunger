# ZeroHunger Client

Frontend application for ZeroHunger project built with React and Vite.

## File Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   └── layouts/         # Layout components
│   │       ├── Footer.jsx
│   │       └── Header.jsx
│   ├── contexts/            # React context providers
│   ├── features/            # Feature-based modules
│   │   ├── ai_food_allergies/
│   │   ├── auth/            # Authentication feature
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── users/
│   ├── services/            # API service functions
│   ├── App.jsx              # Main app component
│   ├── index.css            # Global styles
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```

## Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd ZeroHunger/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on http://localhost:5173 by default.

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4
- ESLint
