# Supervisor Scheduler - Shift Optimization Algorithm

This project implements an intelligent shift planning algorithm for a mining company, designed to comply with strict operational coverage and safety rules.

## 🚀 Key Features

*   **"Coverage-First" Decision Engine**: Mathematically guarantees **exactly 2 supervisors are always drilling**, dynamically adjusting the rest periods of Supervisors 2 and 3.
*   **Multi-Regimen Support**: Works with any configuration (14x7, 21x7, etc.) and variable induction days.
*   **Executive Dashboard**: Real-time efficiency and utilization metrics.
*   **Professional Export**: Report generation in CSV (Excel compatible) and print-optimized PDF.
*   **Persistence**: Automatically saves the last used configuration.
*   **Large Scale Simulation**: Supports long-term projections up to 2000 days.

## 🛠️ Tech Stack

*   **Core**: React 18 + Vite
*   **Language**: Javascript (ES6+) with Robust Architecture and Clean Code.
*   **Styles**: Modern CSS3 (Variables, Flexbox, Grid) - No heavy external libraries.
*   **Validation**: Automated test scripts (`scripts/verify.js`) for quality assurance.

## 📦 Installation and Deployment

### Prerequisites
*   Node.js (v16 or higher)
*   npm

### Local Development
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port indicated in the console).

### Production Build (Deploy)
To generate optimized static files for uploading to Netlify, Vercel, or Apache/Nginx:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  This will generate a `dist/` folder.
3.  **Copy the contents of `dist/`** to the public root of your web server.

## 🧪 Algorithm Verification

To run the test suite that validates the 5 fundamental use cases and business rules:

```bash
node scripts/verify.js
```

## 📄 Technical Documentation

A detailed technical analysis, including the mathematical justification of the solution against the requirement examples, is available within the application (Link "Technical Report") or in the file `public/technical_report.html`.
