# Astro Application with Clerk Authentication

Astro application with Clerk authentication integration for user registration and login.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 🔐 Authentication

This application uses [Clerk](https://clerk.com) for authentication. Users can register and log in via `/sign-up` and `/sign-in` pages.

### Setup

1. Create a Clerk account and development application at [Clerk Dashboard](https://dashboard.clerk.com/)
2. Get your API keys from Clerk Dashboard → API Keys
3. Create a `.env` file in the project root:

```env
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

4. Start the development server: `pnpm dev`
5. Navigate to `/sign-up` to register or `/sign-in` to log in

### Authentication Pages

- `/sign-up` - Registration page (accessible without authentication)
- `/sign-in` - Login page (accessible without authentication)
- `/profile` - User profile page (requires authentication)

For detailed setup instructions, see [quickstart.md](./specs/006-clerk-auth/quickstart.md).

## 👀 Want to learn more?

- [Astro Documentation](https://docs.astro.build)
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Astro Integration](https://docs.astro.build/en/guides/authentication/)
