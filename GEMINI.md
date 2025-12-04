# GEMINI.md

## Project Overview

This is a creative frontend project built with **React**, **TypeScript**, and **Vite**. It showcases advanced 3D graphics on the web using **`@react-three/fiber`** and **`@react-three/drei`**, which are powerful libraries for creating 3D scenes with Three.js in a declarative React way.

The application features a simple navigation to switch between two different interactive 3D scenes:
*   **Particles Scene**: An interactive particle system that reacts to mouse movement, likely implemented with GPU shaders for performance.
*   **Glass Scene**: A scene demonstrating realistic glass-like material effects with light transmission and refraction.

The code appears to be written in Polish, which is an important convention to be aware of for future modifications.

## Building and Running

The project is managed with `npm`. The following scripts are available in `package.json`:

*   **`npm run dev`**: Starts the development server with Hot Module Replacement (HMR) for a fast feedback loop. The application will be available at a local URL (e.g., `http://localhost:5173`).
*   **`npm run build`**: Compiles the TypeScript code and bundles the application for production. The output is placed in the `dist` directory.
*   **`npm run lint`**: Runs ESLint to check the codebase for style and consistency issues.
*   **`npm run preview`**: Starts a local server to preview the production build from the `dist` directory.

### Key Commands:
*   To install dependencies: `npm install`
*   To start development: `npm run dev`
*   To build for production: `npm run build`

## Development Conventions

*   **Language**: The primary language used in the UI and component source code is Polish.
*   **Styling**: Inline CSS-in-JS is used for component styling. There are also global CSS files (`index.css`, `App.css`).
*   **Component Structure**: The main application logic resides in `src/App.tsx`, which conditionally renders scene components from the `src/components/` directory.
*   **Linting**: The project uses ESLint for code quality, with configurations found in `eslint.config.js`. The setup is based on the standard Vite template for React and TypeScript.
*   **3D Graphics**: The 3D scenes are built declaratively using `@react-three/fiber`, with components for each scene (`ParticlesScene.tsx`, `GlassScene.tsx`).
