import { useState } from "react"

export default function Navbar(){

  const [open,setOpen] = useState(false)

  return(
    <nav className="px-6 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50
                    bg-gradient-to-r from-sky-100 via-white to-green-100
                    text-slate-800 shadow-md backdrop-blur border-b border-green-200">

      {/* LOGO */}
      <div className="text-lg md:text-xl font-bold tracking-wide">
        ♻ W M S
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex gap-6 items-center font-semibold">

        <a href="/" className="hover:text-green-600 transition">Home</a>
        <a href="/about" className="hover:text-green-600 transition">About</a>
        <a href="/login" className="hover:text-green-600 transition">Login</a>

        <a href="/register"
           className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
          Register
        </a>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-2xl"
        onClick={()=>setOpen(!open)}
      >
        ☰
      </button>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="absolute top-16 left-0 w-full
                        bg-white border-t border-green-200
                        flex flex-col items-center gap-4 py-6 md:hidden">

          <a href="/" onClick={()=>setOpen(false)} className="hover:text-green-600">Home</a>
          <a href="/about" onClick={()=>setOpen(false)} className="hover:text-green-600">About</a>
          <a href="/login" onClick={()=>setOpen(false)} className="hover:text-green-600">Login</a>

          <a href="/register"
             onClick={()=>setOpen(false)}
             className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600">
            Register
          </a>

        </div>
      )}

    </nav>
  )
}