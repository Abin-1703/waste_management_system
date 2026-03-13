import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"

export default function Login() {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try{
      setLoading(true)

      const res = await api.post("accounts/login/",{
        username,
        password
      })

      localStorage.setItem("token",res.data.token)
      localStorage.setItem("role",res.data.role)

      if(res.data.role === "admin"){
        navigate("/admin")
      }
      else if(res.data.role === "collector"){
        navigate("/collector")
      }
      else{
        navigate("/dashboard")
      }

    }catch(err){
      alert("Invalid credentials")
    }finally{
      setLoading(false)
    }
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 via-emerald-100 to-white px-4">

      {/* glow */}
      <div className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] bg-emerald-300 opacity-20 blur-[120px] rounded-full"></div>

      {/* card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 text-center">

        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-2">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Login to manage waste pickups efficiently
        </p>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full p-4 mb-4 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-4 mb-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
        />

        <div className="text-right mb-6">
          <span
            onClick={()=>navigate("/forgot")}
            className="text-sm text-emerald-700 font-semibold cursor-pointer hover:underline"
          >
            Forgot Password?
          </span>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-4 rounded-lg font-bold text-white text-base sm:text-lg transition shadow-lg
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 hover:scale-[1.02]"
            }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="mt-6 text-sm text-gray-600">
          New here?{" "}
          <span
            onClick={()=>navigate("/register")}
            className="text-emerald-700 font-bold cursor-pointer hover:underline"
          >
            Create account
          </span>
        </div>

      </div>
    </div>
  )
}