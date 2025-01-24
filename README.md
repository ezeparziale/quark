# :milky_way: Quark

Quark is a template ready for tools using @nextjs 15 🚀

## :star: Features

- Log in/Sign up with credentials or Google/GitHub account
- Reset password
- Confirm account via email
- Light and Dark mode
- Account settings
- Admin mode
- Role-based access control
- Send feedback
- Admin API
- More features are coming...

## :construction_worker: Built using

- **NextJS 15** @nextjs
- **Hosted at** @vercel
- **Auth with credentials and Google/GitHub** @nextauthjs v5
- **UI** @shadcn and @tailwindcss v4
- **DB** @PostgreSQL
- **ORM** @prisma
- **RBAC**
- **React server actions**
- **Admin mode**
- **Email** react-email
- **Validation** @zodtypes
- **Tables** tanstack/react-table
- **Forms** @HookForm
- **API Documentation** Swagger UI
- **OpenAPI** zod-openapi

## :rocket: Getting Started

To get started with Quark, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/ezeparziale/quark.git
   ```
2. Install dependencies:
   ```bash
   cd quark
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## :whale: Using Docker Compose

To set up PostgreSQL using Docker Compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Start the PostgreSQL container:
   ```bash
   docker-compose up -d
   ```
3. The PostgreSQL database will be available at `localhost:5432`.
