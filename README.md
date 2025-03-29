# Sana Logistics

A Vite + React project.

## Getting Started

These instructions will help you set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Make sure you have Node.js version 20+ and Yarn installed on your machine.

- Node.js: [Download here](https://nodejs.org/)
- Yarn: [Installation instructions](https://classic.yarnpkg.com/en/docs/install/)

### Installing

1. Clone the repository:

2. Change into the project directory:

3. Install dependencies:
```bash
yarn install
```

## Running the Development Server
Start the development server:
```bash
yarn dev
```
Visit http://localhost:5173 in your browser to see the app.

## Building for Production
To build the project for production, run:
```bash
yarn build
```
The optimized build will be available in the dist directory.

## Built With
Vite - Next Generation Frontend Tooling

React - A JavaScript library for building user interfaces

## The project structure
This project structure organizes a React application into different directories based on their functionality. 

```bash
.
├── App.tsx
├── assets
├── common
│   ├── components
│   ├── layouts
│   ├── navs
│   └── theme.ts
├── config
│   └── env.ts
├── features
│   ├── auth
│   │   └── login
│   │       ├── hooks.ts
│   │       ├── services.ts
│   │       ├── stores.ts
│   │       ├── types.ts
│   │       └── ui
│   │           ├── login_form.tsx
│   │           └── signup_form.tsx
│   ├── dashboard
│   │   ├── home
│   │   │   ├── services.ts
│   │   │   ├── stores.ts
│   │   │   ├── types.ts
│   │   │   └── ui
│   │   │       ├── DashboardStatistics.tsx
├── index.css
├── main.tsx
├── pages
│   ├── auth
│   │   └── login.tsx
│   ├── dashboard
│   │   ├── dashboard.tsx
│   │   ├── inventory.tsx
│   ├── error.tsx
│   ├── not_found.tsx
│   └── eshop
│       ├── home.tsx
├── routes
│   ├── auth_role.tsx
│   └── Router.tsx
└── ...

```
Here's a summary of the directories and their contents:

- **src:** This is the main directory containing all source code files.
   - **App.tsx:** The main component of the application.
   - **assets:** Directory for storing static assets like images, SVGs, and other files.
   - **common:** Contains reusable components, layouts, and theme configurations.
   - **components:** Reusable UI components like buttons, inputs, etc.
   - **layouts:** Layout components for different pages or sections of the application.
   - **navs:** Navigation components like headers, footers, and sidebars.
   - **theme.ts:** Theme configuration file.
- **config:** Configuration files for environment variables, API endpoints, etc.
- **features:** Contains modules or features of the application.
   - **<feature-name>:** Directories for individual features.
      - **hooks.ts:** Custom hooks specific to the feature.
      - **services.ts**: Service functions for interacting with APIs or handling business logic.
      - **stores.ts:** Store files for managing state using libraries like Redux.
      - **types.ts:** Type definitions related to the feature.
      - **ui:** UI components specific to the feature.
- **hooks:** Custom hooks that can be reused across features.
- **pages:** React components representing different pages of the application.
- **routes:** Route components for defining application routes and routing logic.
