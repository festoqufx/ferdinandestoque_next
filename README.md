# Ferdinand Estoque — Portfolio

A modern, responsive portfolio website built with **Next.js 14 (App Router)**, **React 18**, and **TypeScript**.

## Features

- **Hero Section**: Dynamic carousel, 3D typography perspective, and custom canvas cursor animations.
- **About & Experience**: Interactive 3D cube animations and comprehensive career timeline.
- **Tech Stack**: 3D interactive spinning skill sphere / tag cloud.
- **Projects**: Filterable portfolio showcase with integrated interactive modal gallery and GitHub links.
- **Infinity Carousel**: 3D perspective slider for featured client websites.
- **Certificates**: Interactive auto-rotating certificate carousel with keyboard and touch gesture support.
- **Ask Anything AI Chatbot**: Built-in intelligent assistant providing instant answers about skills, projects, and contact info.
- **Sound Effects & Theme Controls**: Ambient web audio sound effects toggle with preference persistence.

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Bootstrap 5, Bootstrap Icons, Font Awesome, Custom CSS
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17 or later recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/festoqufx/ferdinandestoque_next.git
   cd ferdinandestoque_next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── api/                  # Next.js API route handlers (Presence, GitHub Calendar, Newsletter, Contact)
│   ├── globals.css           # Global stylesheets and fonts
│   ├── layout.tsx            # Root layout with metadata and scripts
│   └── page.tsx              # Main portfolio home page
├── components/               # Modular React components
│   ├── About.tsx
│   ├── AskAnything.tsx
│   ├── BackToTop.tsx
│   ├── Certificates.tsx
│   ├── Contact.tsx
│   ├── Experience.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Hobbies.tsx
│   ├── InfinityCarousel.tsx
│   ├── Marquee.tsx
│   ├── Portfolio.tsx
│   ├── Ravenom.tsx
│   ├── Services.tsx
│   ├── Skills.tsx
│   ├── SkillsPerspective.tsx
│   ├── Slicebox.tsx
│   ├── SoundToggle.tsx
│   ├── Testimonials.tsx
│   └── VideoSection.tsx
├── public/
│   └── assets/               # Static assets (images, fonts, stylesheets, vendor libraries)
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies and scripts
```

## License

All rights reserved &copy; Ferdinand Estoque.
