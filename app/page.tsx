"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  useEffect(() => {
    if (!user) return;
    
    fetchBookmarks();
    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addBookmark = async () => {
    if (!title || !url || !user) return

    await supabase.from("bookmarks").insert([
      { title, url, user_id: user.id }
    ])

    setTitle("")
    setUrl("")
    fetchBookmarks()
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
    fetchBookmarks()
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-slate-900 to-blue-900">
      {!user ? (
        /* LOGIN SCREEN */
        <div className="flex flex-col items-center justify-center min-h-screen text-center gap-15">
          <h1 className="text-5xl font-extrabold text-cyan-400 tracking-tight drop-shadow-lg">
            SMART BOOKMARK APP
          </h1>

          <button
            onClick={signInWithGoogle}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg
            transition-all duration-300 cursor-pointer font-bold text-lg
            hover:bg-red-500 hover:scale-105 active:scale-95"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        /* DASHBOARD */
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 border-b border-gray-700 pb-4 flex justify-between items-center">
            <p className="text-White text-lg">
              Welcome,{" "}
              <span className=" font-medium">
                {user.email}
              </span>
            </p>

            <button
              onClick={signOut}
              className="bg-blue-500 hover:bg-red-500 text-white px-4 py-2 rounded-md
              transition-all cursor-pointer text-sm font-medium"
            >
              Logout
            </button>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <input
              className="border border-gray-600 bg-gray-800 text-white p-3 rounded flex-1
              outline-none focus:border-blue-500 transition-colors"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="border border-gray-600 bg-gray-800 text-white p-3 rounded flex-1
              outline-none focus:border-blue-500 transition-colors"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={addBookmark}
              className="bg-red-500 hover:bg-blue-500 text-white px-6 py-3
              rounded font-bold transition-all cursor-pointer"
            >
              Add
            </button>
          </div>

          <ul className="space-y-4">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.id}
                className="flex items-center justify-between bg-gray-900 p-4
                rounded-md border border-gray-800 hover:shadow-md transition-shadow"
              >
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-400 hover:text-blue-300 underline
                  font-medium truncate mr-4"
                >
                  {bookmark.title}
                </a>

                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="text-red-500 hover:text-red-700
                  transition-colors cursor-pointer text-sm font-medium"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
