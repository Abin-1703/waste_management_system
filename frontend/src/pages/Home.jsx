import React, { useEffect, useState } from "react";

export default function Home() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/accounts/count/")
        const data = await res.json()

        let i = 0
        const interval = setInterval(() => {
          i += 1
          setCount(i)
          if (i >= data.count) {
            clearInterval(interval)
          }
        }, 20)

      } catch {
        console.log("Count load failed")
      }
    }
    loadCount()
  }, [])

  const images = [
    "https://images.unsplash.com/photo-1528323273322-d81458248d40",
    "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-50 to-white text-slate-800">

      {/* HERO */}
      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div className="text-center md:text-left">

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
              Smart Waste Pickup Platform
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mt-5 max-w-lg mx-auto md:mx-0">
              Schedule waste pickup, track requests and make your city cleaner.
            </p>

            <div className="mt-8 inline-block bg-white shadow-xl rounded-2xl px-8 py-6 sm:px-10 sm:py-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-emerald-700">{count}+</h2>
              <p className="opacity-70 mt-1 text-sm">Users joined our system</p>
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="relative w-full h-[220px] sm:h-[300px] md:h-[420px] overflow-hidden rounded-3xl shadow-lg">

            <img
              src={images[index]}
              className="w-full h-full object-cover transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-lg sm:text-xl font-semibold">
                Sustainable Waste Management
              </h3>
              <p className="text-xs sm:text-sm opacity-90">
                Reduce pollution • Recycle smarter • Build cleaner cities
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-20 max-w-6xl mx-auto">
        {[
          ["Easy Pickup Scheduling", "Request waste collection in seconds."],
          ["Track Requests", "Monitor pickup status in real time."],
          ["Cleaner Environment", "Reduce pollution with organized disposal."]
        ].map(([title, text]) => (
          <div key={title}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:-translate-y-2 transition">
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-700 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm sm:text-base">{text}</p>
          </div>
        ))}
      </section>

      {/* ABOUT */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-white to-sky-50">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">About Our Platform</h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-sm sm:text-lg leading-relaxed">
          The Smart Waste Pickup Platform simplifies waste management for citizens,
          collectors and administrators creating cleaner and more efficient cities.
          Our Smart Waste Pickup Platform is designed to make cities cleaner, smarter,
          and more sustainable, With easy scheduling, real-time tracking, and improved communication.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-gradient-to-r from-sky-200 to-emerald-200">
        <h2 className="text-2xl sm:text-4xl font-bold mb-3">Join the Clean City Movement</h2>
        <p className="text-gray-700 text-sm sm:text-lg">
          Create your account and schedule your first pickup today.
        </p>

        <a
          href="/register"
          className="inline-block mt-6 bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl shadow hover:bg-emerald-500 transition"
        >
          Get Started
        </a>
      </section>

      <footer className="text-center py-5 bg-white border-t text-gray-500 text-sm">
        © 2026 Waste Management System
      </footer>

    </div>
  );
}