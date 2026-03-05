import { useState } from "react"
import api from "../api"

export default function Register(){

  const [form,setForm] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""   
  })

  const [loading,setLoading] = useState(false)
  const [message,setMessage] = useState("")

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // PASSWORD MATCH CHECK
    if(form.password !== form.confirmPassword){
      setMessage("Passwords do not match")
      setLoading(false)
      return
    }

    try{
      await api.post("/accounts/register/", {
        username:form.username,
        email:form.email,
        password:form.password
      })
      setMessage("Account created successfully")
    }catch(err){
      setMessage(" " + JSON.stringify(err.response?.data))
    }

    setLoading(false)
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-emerald-100 to-white px-4">

      {/* glow */}
      <div className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] bg-sky-300 opacity-20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 text-center">

        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-sm mb-8">
          Join the Smart Waste Platform
        </p>

        <form onSubmit={handleSubmit}>

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-4 mb-4 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 mb-4 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 mb-4 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
          />

          {/* CONFIRM PASSWORD FIELD */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-4 mb-6 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
          />

          <button
            className={`w-full py-4 rounded-lg font-bold text-white text-base sm:text-lg transition shadow-lg
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 hover:scale-[1.02]"
              }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>

        </form>

        {message && (
          <p className="mt-5 text-sm font-medium text-emerald-700">
            {message}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?
          <a href="/login" className="ml-2 text-emerald-700 font-bold hover:underline">
            Login
          </a>
        </p>

      </div>
    </div>
  )
}