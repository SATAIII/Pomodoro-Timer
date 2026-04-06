# ⏳ Pomodoro Tracker

A beautiful, feature-rich **Pomodoro Timer** web application built to help you stay focused and productive. Based on the Pomodoro Technique, this app breaks your work into intervals separated by short breaks — keeping you in the zone and preventing burnout.

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **shadcn/ui**, and **Zustand**. Installable as a **Progressive Web App (PWA)** on any device.

## Page URL
<https://pomodoro-timer-six-weld.vercel.app/>

---

## ✨ Features

### Core Timer
- **Start / Pause / Resume / Reset** — Full control over your focus sessions
- **Skip Session** — Jump ahead to the next work or break period
- **Auto-Transition** — Seamlessly moves from work → short break → work → ... → long break
- **Sound Notification** — A pleasant bell chord plays when each session ends
- **Live Document Title** — Browser tab shows the running countdown so you always know time remaining

### Configurable Settings
- **Work Duration** — Default 25 minutes (adjustable 1–120 min)
- **Short Break** — Default 5 minutes (adjustable 1–30 min)
- **Long Break** — Default 15 minutes (adjustable 1–60 min), triggered after every 4 work sessions
- **Auto-Start Breaks** — Optionally start break sessions automatically
- **Auto-Start Work** — Optionally start work sessions automatically after a break

### Session Tracking
- **Completed Sessions Counter** — Tracks how many focus sessions you've finished
- **Today's Stats** — Shows today's completed sessions and total focus minutes
- **Progress Dots** — Visual indicator of where you are in the current cycle
- **Session History** — Scrollable log of all recent sessions with timestamps
- **Clear History** — Option to reset all session data

### PWA & Offline
- **Installable** — Add to Home Screen on iOS, Android, and desktop browsers
- **Offline Support** — Service worker caches the app for use without internet
- **Auto-Update** — Prompts when a new version is available

### Accessibility & UX
- **Keyboard Shortcuts** — `Space` (Start/Pause/Resume), `R` (Reset), `S` (Skip)
- **ARIA Labels** — Screen reader support for all interactive elements
- **Semantic HTML** — Proper `role`, `aria-live`, and `aria-label` attributes
- **Responsive Design** — Mobile-first layout that adapts beautifully to desktop
- **Dark Mode Ready** — Follows system theme preference
- **Smooth Animations** — Framer Motion transitions throughout

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [TypeScript 5](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [shadcn/ui](https://ui.shadcn.com/) | Pre-built accessible UI components |
| [Zustand](https://zustand.docs.pmnd.rs/) | Lightweight state management with persistence |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations |
| [Lucide React](https://lucide.dev/) | Beautiful open-source icons |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Notification sounds |
| [date-fns](https://date-fns.org/) | Date formatting |

---

## 📁 Project Structure

```
pomodoro-tracker/
├── public/
│   ├── icons/                          # App icons for favicon & PWA
│   │   ├── icon-512.png                #   PWA splash icon (512×512)
│   │   ├── icon-192.png                #   Android PWA icon (192×192)
│   │   ├── apple-touch-icon.png        #   iOS home screen icon (180×180)
│   │   ├── favicon-32.png              #   Standard favicon (32×32)
│   │   ├── favicon-16.png              #   Small favicon (16×16)
│   │   └── favicon.ico                 #   Legacy favicon (48×48)
│   ├── manifest.json                   # PWA manifest
│   └── sw.js                           # Service worker (offline caching)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with PWA meta tags
│   │   ├── page.tsx                    # Main page (timer UI)
│   │   └── globals.css                 # Global styles & Tailwind config
│   │
│   ├── components/
│   │   ├── pomodoro/
│   │   │   ├── timer-display.tsx       # Circular SVG progress ring timer
│   │   │   ├── timer-controls.tsx      # Play/Pause/Reset/Skip buttons
│   │   │   ├── session-selector.tsx    # Focus/Short Break/Long Break tabs
│   │   │   ├── settings-dialog.tsx     # Timer configuration dialog
│   │   │   ├── session-history.tsx     # Stats & session history panel
│   │   │   └── service-worker-register.tsx  # PWA service worker registration
│   │   └── ui/                         # shadcn/ui component library
│   │
│   ├── hooks/
│   │   ├── use-timer.ts                # 1-second interval timer hook
│   │   └── use-keyboard-shortcuts.ts   # Keyboard navigation hook
│   │
│   ├── store/
│   │   └── pomodoro-store.ts           # Zustand store (state + persistence)
│   │
│   └── lib/
│       └── utils.ts                    # Utility functions
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── eslint.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** ≥ 18.17 (recommended: 20+)
- **Bun** ≥ 1.0 (or alternatively **npm** / **yarn** / **pnpm**)
- **Git** (for cloning the repository)

> This project uses `bun` as the default package manager. If you prefer `npm`, simply replace every `bun` command with `npm` in the instructions below.

### 1. Clone the Repository

```bash
git clone <https://github.com/SATAIII/Pomodoro-Timer.git>
cd pomodoro-tracker
```

### 2. Install Dependencies

```bash
bun install
```

This installs all required packages including Next.js, React, Tailwind CSS, shadcn/ui components, and all other dependencies listed in `package.json`.

### 3. Run the Development Server

```bash
bun run dev
```

The app starts at **http://localhost:3000**. Open it in your browser and start your first Pomodoro session!

### 4. Build for Production

```bash
bun run build
```

This creates an optimized production build in the `.next` directory with standalone output.

### 5. Start the Production Server

```bash
bun run start
```

The production server starts at **http://localhost:3000**.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Start timer / Pause / Resume |
| `R` | Reset current timer |
| `S` | Skip to next session |

> Keyboard shortcuts are disabled when typing in input fields (e.g., the settings dialog).

---

## 📱 Installing as a PWA

### On Android (Chrome)
1. Open the app in Chrome
2. Tap the **three-dot menu** (⋮) in the top-right corner
3. Select **"Install app"** or **"Add to Home screen"**
4. Confirm the installation prompt

### On iOS (Safari)
1. Open the app in Safari
2. Tap the **Share button** (📤) at the bottom
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm

### On Desktop (Chrome / Edge)
1. Open the app in Chrome or Edge
2. Click the **install icon** in the address bar (or the three-dot menu → "Install app")
3. Confirm the installation prompt
4. The app opens in its own window without browser chrome

---

## 🔧 Configuration

All timer settings can be configured through the **Settings** dialog (⚙️ gear icon in the header):

| Setting | Default | Range |
|---|---|---|
| Focus Duration | 25 min | 1–120 min |
| Short Break Duration | 5 min | 1–30 min |
| Long Break Duration | 15 min | 1–60 min |
| Long Break After | 4 sessions | 2–10 sessions |
| Auto-Start Breaks | Off | On / Off |
| Auto-Start Work | Off | On / Off |

Settings and session history are **automatically persisted** to `localStorage`, so they survive browser refreshes and page reloads.

---

## 🧩 How It Works

The app follows the classic **Pomodoro Technique** workflow:

1. **Focus Session** (25 min) — Deep work on your task
2. **Short Break** (5 min) — Rest and recharge
3. Repeat steps 1–2 for a total of **4 focus sessions**
4. **Long Break** (15 min) — A longer recovery period
5. Return to step 1

After each work session completes, a notification sound plays and the timer automatically transitions to the appropriate break type. If auto-start is enabled, the next session begins immediately.

---

## 🧪 Linting

Run the linter to check code quality:

```bash
bun run lint
```

---

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.
