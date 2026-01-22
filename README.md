# Coinvert

Coinvert is a modern currency conversion application built with Next.js 16, React 19, and Tailwind CSS. It allows users to convert between different currencies with real-time exchange rates and a seamless user interface.

## Getting Started

To get started with the project, follow these steps:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project is organized into the following directories and files:

### `app/`

Contains the main application logic, following the Next.js App Router structure.

- `layout.tsx`: The root layout of the application. It defines the basic HTML structure, fonts, and global styles wrapper.
- `page.tsx`: The main page of the application that renders the currency converter interface. It handles the user interaction for selecting currencies and entering amounts.
- `globals.css`: The global stylesheet, including Tailwind CSS directives and custom transitions.
- `favicon.ico`: The favicon for the application.

### `components/`

Contains reusable UI components used throughout the application.

- `CurrencyDropdown.tsx`: A custom dropdown component for selecting currencies. It features search functionality and displays currency flags and codes.
- `ui/`: A directory containing generic UI components (likely from Shadcn/UI or similar), such as buttons and dropdown primitives.

### `data/`

Contains static data files used by the application.

- `currency-codes.ts`: Exports a list of currency codes and their metadata (name, country, etc.) used to populate the dropdowns.

### `lib/`

Contains core library code, including state management and utility functions.

- `store.ts`: Implements the application state management using Zustand. It handles the state for selected currencies, exchange rates, and conversion logic.
- `utils.ts`: Contains general utility class merging functions (using `clsx` and `tailwind-merge`) for conditional class rendering.

### `types/`

Contains TypeScript type definitions to ensure type safety across the application.

- `exchange.ts`: Defines interfaces and types related to exchange rates, currency objects, and API responses.

### `utils/`

Contains specific utility functions for the application logic.

- `currency-to-flag.ts`: A helper function `getCountryCode` that maps currency codes to their respective country codes (ISO 3166-1 alpha-2) for displaying flags using `flag-icons` or similar.

### Root Files

Configuration and project management files.

- `package.json`: Lists the project dependencies (React, Next.js, Tailwind, Zustand, etc.) and scripts.
- `tsconfig.json`: TypeScript configuration file.
- `next.config.ts`: Next.js configuration settings.
- `postcss.config.mjs` & `eslint.config.mjs`: Configurations for PostCSS and ESLint respectively.
- `components.json`: Configuration for component libraries (typically Shadcn/UI).
- `structure.txt`: A text file outlining the planned or theoretical structure of the project.
- `TODOS.txt`: A simple text file for tracking todo items and tasks.
