# Cookie Consent Application

A robust, production-ready React application showcasing a customizable Cookie Consent banner, built with React Router and Tailwind CSS. 

## Features

### 🍪 Cookie Consent Banner
An interactive, fully functional cookie consent management banner. Features include:
- **Automatic display** if no essential cookie preferences have been set.
- **Manage Cookies Modal** allowing users to selectively toggle **Analytics** and **Marketing** cookies (while keeping **Essentials** strictly required).
- One-click **"Accept All"** and **"Decline All"** functionalities.
- Intelligent script loading based strictly on user preferences. 
- Integrated unit tests using **Jest** and **React Testing Library** for high reliability.

### 🧩 Reusable UI Components
This project is built using a scalable, component-driven architecture with several generic, highly-reusable UI components:

#### `Modal` & `ModalStack`
- Supports complex **stacking of Modals** (e.g., opening a "Manage Cookies" modal on top of a base UI or banner) via the `<ModalStack>` container.
- Complete accessibility support with automated focus trapping (`useFocusTrap`) and keyboard shortcuts (`Escape` to close).
- Modular design (`Modal.Header`, `Modal.Body`, `Modal.Footer`) for maximum layout flexibility.

#### `Button`
- Fully customized, accessible buttons with multiple intent states (`primary`, `secondary`, `tertiary`, `destructive`) using **CVA (class-variance-authority)**.

#### `Toggle` (Switch)
- Reusable, accessible boolean switch component utilizing `role="switch"` and screen-reader compliant `aria-label`s.

## Tech Stack & Styling

- **React Router (v8)**: Modern routing and server-side rendering setup.
- **Tailwind CSS**: Utility-first CSS framework for rapid, responsive styling. We use `tailwind-merge` and `clsx` for intelligent class string merging across all generic components.
- **Jest & React Testing Library**: For testing DOM components and ensuring behavior integrity, running via `@swc/jest` for blazing fast TypeScript compilation.

---

## Getting Started

### Installation

Install all project dependencies:

```bash
npm install
```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Running Tests

We use Jest and React Testing Library for our test suite. To run the tests:

```bash
npm test
```

## Deployment

To build the application for production:

```bash
npm run build
```

Then you can serve the application using the built-in React Router server:
```bash
npm run start
```
