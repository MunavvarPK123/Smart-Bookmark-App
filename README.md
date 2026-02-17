# Smart Bookmark App

A simple bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.  
Users can log in with Google, add bookmarks, and see updates in real-time. Each user’s bookmarks are private.

# Features

- Sign in with Google OAuth only (no email/password)
- Add bookmarks (Title + URL)
- Delete your own bookmarks
- Bookmarks update in real-time across active tabs
- Private bookmarks per user
- Responsive design using Tailwind CSS

# Tech Stack Used

- Frontend: Next.js (App Router)  
- Backend : Supabase (Auth, Database, Realtime)  
- Styling: Tailwind CSS

# Live Demo

https://smartbookmarkapp-nu.vercel.app/

# Setup Instructions

1. Clone the repository

git clone https://github.com/MunavvarPK123/smart-bookmark-app.git
cd smart-bookmark-app

2. Install dependencies

npm install

3. Environment Variables

Created a .env file in the project root with:

NEXT_PUBLIC_SUPABASE_URL=supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key

These values are not included in the repository for security

4. Run locally

npm run dev
Open http://localhost:3000 in your browser.

5. Deploy

Deployed on Vercel using the live URL above.

# Challenges Faced & Solutions

1. Google login redirected to localhost after deployment
   - Solution: Added the Vercel URL to Supabase Auth → Redirect URLs.

2. Real-time updates on mobile tabs delayed
   - Solution: Noted that mobile browsers throttle background tabs; updates work instantly in active tabs.

3. Environment variables missing on Vercel deploy
   - Solution: Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel dashboard → redeployed.
