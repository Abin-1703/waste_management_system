import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function Admin(){

  const [search,setSearch] = useState("")
  const [statusFilter,setStatusFilter] = useState("all")
  const [requests,setRequests] = useState([])
  const [collectors,setCollectors] = useState([])
  const [form,setForm] = useState({})

  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const logout = ()=>{
    localStorage.removeItem("token")
    navigate("/")
  }

  const load = async()=>{
    try{
      const res = await api.get("waste/admin/",{
        headers:{ Authorization:`Token ${token}` }
      })
      setRequests(res.data)
    }catch{
      alert("Admin load failed")
    }
  }

  const loadCollectors = async()=>{
    try{
      const res = await api.get("accounts/collectors/",{
        headers:{ Authorization:`Token ${token}` }
      })
      setCollectors(res.data)
    }catch{
      console.log("Collector load failed")
    }
  }

  useEffect(()=>{ load(); loadCollectors() },[])

  const handleChange = (id,field,value)=>{
    setForm(prev=>({
      ...prev,
      [id]:{ ...prev[id], [field]:value }
    }))
  }

  const update = async(id)=>{
    const data = form[id] || {}
    try{
      await api.patch(`waste/admin/update/${id}/`,{
        status:data.status,
        pickup_date:data.pickup,
        collector:data.collector
      },{
        headers:{ Authorization:`Token ${token}` }
      })
      load()
    }catch{
      alert("Update failed")
    }
  }

  const getColor = (status)=>{
    if(status==="pending") return "bg-yellow-400"
    if(status==="assigned") return "bg-sky-500"
    if(status==="completed") return "bg-green-500"
    return "bg-gray-400"
  }

  const pending = requests.filter(r=>r.status==="pending").length
  const assigned = requests.filter(r=>r.status==="assigned").length
  const completed = requests.filter(r=>r.status==="completed").length

  const chartData = {
    labels:["Pending","Assigned","Completed"],
    datasets:[{
      data:[pending,assigned,completed],
      backgroundColor:["#facc15","#38bdf8","#22c55e"],
      borderWidth:0
    }]
  }

  const filteredRequests = requests.filter(r=>{
    const matchSearch =
      r.address?.toLowerCase().includes(search.toLowerCase()) ||
      r.waste_type?.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      statusFilter==="all" || r.status===statusFilter

    return matchSearch && matchStatus
  })

  return(
    <div className="min-h-screen px-4 md:px-8 py-6 bg-gradient-to-br from-sky-100 via-blue-50 to-green-100">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow font-semibold w-full md:w-auto"
        >
          Logout
        </button>
      </div>

      {/* STATS + CHART */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">

        <Stat title="Pending" value={pending}/>
        <Stat title="Assigned" value={assigned}/>
        <Stat title="Completed" value={completed}/>
        <Stat title="Total Requests" value={requests.length}/>

        <div className="bg-white p-4 rounded-xl shadow w-full max-w-xs">
          <Doughnut data={chartData}/>
        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search by address, waste, or user..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white border shadow focus:outline-none focus:ring-2 focus:ring-sky-400 flex-1"
        />

        <select
          value={statusFilter}
          onChange={e=>setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white border shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* REQUESTS */}
      {filteredRequests.map(r=>(
        <div key={r.id}
          className="bg-white p-6 mb-5 rounded-2xl shadow-lg border-l-8 border-sky-400">

          <h3 className="text-lg font-semibold text-slate-800">{r.waste_type}</h3>

          <p className="text-sm text-gray-600 mt-2">
            <b>User:</b> {r.user}<br/>
            <b>Quantity:</b> {r.quantity}<br/>
            <b>Address:</b> {r.address}<br/>
            <b>Collector:</b> {r.collector_name || "Not assigned"}<br/>
            <b>Status:</b>{" "}
            <span className={`px-3 py-1 rounded-full text-white text-xs ${getColor(r.status)}`}>
              {r.status}
            </span>
          </p>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-4">

            <input
              type="date"
              onChange={e=>handleChange(r.id,"pickup",e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />

            <select
              onChange={e=>handleChange(r.id,"status",e.target.value)}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="">Change Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>

            <select
              onChange={e=>handleChange(r.id,"collector",e.target.value)}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="">Assign Collector</option>
              {collectors.map(c=>(
                <option key={c.id} value={c.id}>{c.username}</option>
              ))}
            </select>

            <button
              onClick={()=>update(r.id)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg shadow font-semibold"
            >
              Update Request
            </button>

          </div>

        </div>
      ))}

    </div>
  )
}

function Stat({title,value}){
  return(
    <div className="bg-white p-5 rounded-xl shadow min-w-[160px]">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
    </div>
  )
}