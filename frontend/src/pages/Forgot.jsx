import { useState } from "react"
import api from "../api"

export default function Forgot(){

  const [email,setEmail] = useState("")

  const send = async()=>{
    try{
      await api.post("accounts/forgot/",{email})
      alert("Reset link sent to email")
    }catch{
      alert("Email not found")
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center px-4
                    bg-gradient-to-br from-sky-100 via-blue-50 to-green-100">

      {/* CARD */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 text-center">

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          🔐 Forgot Password
        </h2>

        <p className="text-sm text-gray-500 mb-8">
          Enter your registered email to receive reset link
        </p>

        <input
          placeholder="Enter your email"
          onChange={e=>setEmail(e.target.value)}
          className="w-full p-4 mb-6 rounded-xl border border-gray-300
                     focus:border-sky-500 focus:ring-2 focus:ring-sky-200
                     outline-none transition"
        />

        <button
          onClick={send}
          className="w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg
                     bg-gradient-to-r from-sky-600 to-green-500
                     hover:from-sky-500 hover:to-green-400
                     hover:scale-[1.02] transition"
        >
          Send Reset Link
        </button>

      </div>
    </div>
  )
}