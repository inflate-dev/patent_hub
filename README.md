# PatentHub - Multilingual Patent Article Aggregator

A modern, multilingual patent article aggregation website built with Next.js, Supabase, and Notion integration. Supports Japanese, English, and Chinese languages with seamless switching.

## Features

- **Public Access**: Browse articles without logging in, with smart access control
- **Article Restrictions**: Non-logged-in users can read 1 free article, then prompted to sign up/login
- **Unlimited Reading**: Logged-in users have unlimited access to all articles
- **Horizontal Article Cards**: Beautiful wide cards with cover images, summaries, and metadata
- **Multilingual Support**: Full internationalization for Japanese (日本語), English, and Chinese (中文)
- **User Authentication**: Secure sign up, login, and session management powered by Supabase
- **Notion Integration**: Fetch and display patent articles from your Notion database
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean design with soft gradient backgrounds and smooth transitions
- **Search & Filter**: Quickly find articles by title, description, or tags
- **User Profiles**: Personalized language preferences saved per user
- **localStorage Tracking**: Track viewed articles for guest users

## Tech Stack

- **Framework**: Next.js 13 with App Router
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Content Source**: Notion API (with mock data fallback)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Key Functionality

### Access Control System

- **Guest Users**: Can read 1 full article for free
- **After First Article**: Shown a restriction screen prompting sign up/login
- **Logged-in Users**: Unlimited article access
- **Tracking**: Uses localStorage to track viewed articles for guests
- **Smart Restrictions**: If guest has already viewed an article, they can re-read it

### Article Display

- **Home Page**: Single-column layout with horizontal article cards
- **Card Content**: Cover image, title, summary, publication date, author, tags
- **Article Detail**: Full-screen article view with rich content
- **Gradient Backgrounds**: Soft, professional gradient backgrounds throughout

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- (Optional) A Notion workspace and integration for real article data

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. The Supabase credentials are already configured in the `.env` file. The database schema has been applied automatically.

4. (Optional) To connect your own Notion database, add these environment variables to `.env`:
```bash
NEXT_PUBLIC_NOTION_TOKEN=your_notion_integration_token
NEXT_PUBLIC_NOTION_DATABASE_ID=your_notion_database_id
```

### Setting Up Notion (Optional)

If you want to use real Notion data instead of mock data:

1. **Create a Notion Integration**:
   - Go to https://www.notion.so/my-integrations
   - Click "New integration"
   - Give it a name (e.g., "PatentHub")
   - Copy the "Internal Integration Token"

2. **Create a Notion Database**:
   - Create a new database in Notion
   - Add the following properties:
     - `Title` (Title)
     - `Description` (Text)
     - `Content` (Text) - Full article body
     - `Published Date` (Date)
     - `Tags` (Multi-select)
     - `Author` (Text)
     - `Language` (Select: en, ja, zh)
   - Add a cover image to each page (optional)

3. **Share Database with Integration**:
   - Open your database in Notion
   - Click "..." menu → "Add connections"
   - Select your integration

4. **Get Database ID**:
   - Copy the database URL
   - The database ID is the 32-character code in the URL
   - Example: `https://notion.so/[database-id]?v=...`

5. **Add to `.env`**:
   - Add `NEXT_PUBLIC_NOTION_TOKEN` and `NEXT_PUBLIC_NOTION_DATABASE_ID`

### Running Locally

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Deployment on Vercel

### Quick Deploy

1. **Push to GitHub**:
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` (already in your .env)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already in your .env)
     - `NEXT_PUBLIC_NOTION_TOKEN` (optional, if using Notion)
     - `NEXT_PUBLIC_NOTION_DATABASE_ID` (optional, if using Notion)
   - Click "Deploy"

3. **Done!** Your site will be live at `https://your-project.vercel.app`

## Project Structure

```
project/
├── app/                    # Next.js app directory
│   ├── articles/[id]/     # Article detail page
│   ├── login/             # Login page
│   ├── signup/            # Sign up page
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page (article listing)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── ArticleCard.tsx   # Horizontal article card
│   ├── ArticleRestrictionScreen.tsx  # Access restriction UI
│   ├── Header.tsx        # Navigation header
│   └── LanguageSwitcher.tsx  # Language selector
├── contexts/             # React context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── LanguageContext.tsx   # i18n state
├── lib/                  # Utility libraries
│   ├── articleViews.ts   # localStorage tracking
│   ├── i18n/            # Internationalization
│   ├── notion/          # Notion API client
│   └── supabase/        # Supabase client and auth
└── public/              # Static assets
```

## Database Schema

The Supabase database includes:

- **profiles** table:
  - `id` (uuid): User ID from auth.users
  - `email` (text): User email
  - `preferred_language` (text): User's preferred language (en/ja/zh)
  - `created_at` (timestamp): Account creation date
  - `updated_at` (timestamp): Last update date

Row Level Security (RLS) policies ensure users can only access their own data.

## Usage Guide

### For Guests (Not Logged In)
1. **Browse Articles**: View the list of articles on the home page
2. **Search**: Use the search bar to filter articles
3. **Read One Article**: Click any article to read it for free
4. **Sign Up Prompt**: After reading one article, you'll be prompted to create an account
5. **Unlimited Access**: Sign up or login to read unlimited articles

### For Logged-In Users
1. **Unlimited Reading**: Access all articles without restrictions
2. **Switch Language**: Use the language switcher (globe icon) in the header
3. **Manage Profile**: Update language preferences in your profile
4. **Track History**: All viewed articles are accessible anytime

## Mock Data

The application includes comprehensive mock patent article data in multiple languages with:
- Cover images from Pexels
- Detailed descriptions and full article content
- Realistic metadata (authors, dates, tags)
- Mixed language content (English, Japanese, Chinese)

When Notion credentials are not configured, the app automatically uses mock data.

## Access Control Logic

- **First Article**: Guests can read any single article completely
- **Article Tracking**: Viewed article IDs stored in browser localStorage
- **Restriction Trigger**: On attempting to view a second article, restriction screen appears
- **Re-reading**: Guests can re-read their one viewed article anytime
- **Login Bypass**: Logged-in users bypass all restrictions

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.
