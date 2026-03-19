# Developer Portfolio

This is a full-stack, dynamic portfolio website built with Next.js, TypeScript, and Supabase. It features a public-facing portfolio to showcase projects and skills, and a complete admin dashboard for content management.

## Features

### Public Portfolio
- **Dynamic Content:** All sections (About, Skills, Projects, etc.) are rendered from data managed in the admin dashboard.
- **Responsive Design:** A mobile-first approach ensures a great experience on all devices.
- **Engaging UI/UX:** Smooth animations and transitions powered by Framer Motion.
- **Multi-language Support:** Fully internationalized for both English and Arabic (RTL support).
- **Theming:** Switch between dark and light modes.
- **Visitor Tracking:** A simple visitor counter to track site engagement.
- **Contact Form:** A validated contact form that saves messages for admin review.

### Admin Dashboard
- **Secure Authentication:** Admin routes are protected using Supabase Auth.
- **Content Management System (CMS):** A comprehensive dashboard to manage all portfolio content without touching the code.
- **CRUD Interfaces for:**
  - Projects (including image uploads)
  - Skills & Skill Categories
  - Professional & Educational Experience
  - Certificates
  - Feedback/Testimonials
  - Visitor Messages
- **Global Settings Management:** Update your name, bio, social links, profile picture, and other site-wide settings.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend & DB:** Supabase (PostgreSQL, Auth, Storage)
- **Styling:** Tailwind CSS
- **UI & Animation:** Framer Motion
- **Form Management:** React Hook Form & Zod
- **Notifications:** React Hot Toast

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v20 or later)
- A Supabase account ([Create one for free](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/KhaledBahjat/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1.  **Create a Supabase Project:** Go to your Supabase dashboard and create a new project.
2.  **Get API Keys:** Navigate to `Project Settings` > `API`. You will need the **Project URL** and the `anon` **public** key.
3.  **Create Tables:** Go to the `Table Editor` and create the following tables. You can use the GUI or the `SQL Editor`.
    - `projects`
    - `skills`
    - `skill_categories`
    - `experience`
    - `certificates`
    - `feedback`
    - `messages`
    - `settings`
    - `visitor_stats`
4.  **Create Storage Bucket:** Go to `Storage`, create a new bucket named `portfolio`, and make it public.
5.  **Create RPC Function:** Go to `Database` > `Functions` and create a new RPC function for the visitor counter:
    ```sql
    -- Function to increment visitor count
    CREATE OR REPLACE FUNCTION increment_visitor_count(increment_by int)
    RETURNS int
    LANGUAGE plpgsql
    AS $$
    DECLARE
      new_val int;
    BEGIN
      UPDATE visitor_stats
      SET count = count + increment_by
      WHERE id = 'visitor_count'
      RETURNING count INTO new_val;
      RETURN new_val;
    END;
    $$;
    ```
    *Note: You may need to insert an initial row into `visitor_stats` with `id = 'visitor_count'` and `count = 0`.*

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of the project and add your Supabase credentials:

```bash
# Get these from your Supabase project's API settings
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>

# Set this to the email you will use for the admin account
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

### 5. Create the Admin User

1.  In your Supabase dashboard, go to `Authentication` > `Users`.
2.  Click `Create user` and create a user with the **exact same email** you set for `NEXT_PUBLIC_ADMIN_EMAIL`.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the public portfolio. Access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

## Project Structure

-   `src/app/(public)`: Contains the public-facing portfolio page.
-   `src/app/admin`: Contains all pages for the admin dashboard, protected by an `AuthGuard`.
-   `src/components/public`: Components used for the public portfolio sections (Hero, About, etc.).
-   `src/components/admin`: Components used within the admin dashboard (Sidebar, Navbar, etc.).
-   `src/components/ui`: Generic, reusable UI components like `Button`, `Modal`, and `Badge`.
-   `src/services`: Contains all functions that interact with Supabase tables (e.g., `getProjects`, `addSkill`).
-   `src/lib/supabase`: The Supabase client initialization and core database/storage helpers.
-   `src/context`: React Context providers for authentication, theme, and language.
-   `src/lib/translations.ts`: Contains the English and Arabic translations for the UI.
-   `src/types`: Defines the TypeScript interfaces for all data models (Project, Skill, etc.).
