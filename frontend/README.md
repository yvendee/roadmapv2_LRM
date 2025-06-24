# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



Here’s an improved version of your sentence for clarity and professionalism:

---

## Initial Setup

For detailed instructions on the initial setup, please refer to this guide:
[Step-by-Step Guide: React 19 + Vite + Tailwind CSS v4.1.5](https://medium.com/@kayydee/got-it-you-want-to-keep-your-react-vite-frontend-completely-separate-inside-a-frontend-folder-58569dc0c624)


## For Local Development:

Then install dependencies:

```bash
npm install
```

Run your development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to see the result.



## Build:

In your React `frontend/` directory:

```bash
npm run build
```

This generates a production-ready static site in `frontend/dist`.

---



## Build and Deploy

# Option 1:

Copy everything from `frontend/dist/` into your Laravel `public/` directory:

```bash
cp -r frontend/dist/* public/
```

This way, your `index.html` (React entry point) is served when visiting `/`.

---


# Option 2:
or Run this command:

```bash
./deploy.sh
```


