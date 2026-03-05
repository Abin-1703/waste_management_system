import { useEffect, useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import "leaflet/dist/leaflet.css"

export default function Dashboard(){

  const [phone,setPhone] = useState("")
  const [image,setImage] = useState(null)
  const [pickupDate,setPickupDate] = useState("")
  const [requests,setRequests] = useState([])
  const [selected,setSelected] = useState([])
  const [quantity,setQuantity] = useState("")
  const [address,setAddress] = useState("")
  const [lat,setLat] = useState(null)
  const [lng,setLng] = useState(null)
  const navigate = useNavigate()

  const wasteTypes = ["Dry","Wet","Glass","Wood","Paper","Metal"]

  const toggleType = (type)=>{
    if(selected.includes(type)){
      setSelected(selected.filter(t=>t!==type))
    }else{
      setSelected([...selected,type])
    }
  }

  const loadRequests = async()=>{
    try{
      const res = await api.get("waste/my/")
      setRequests(res.data)
    }catch(err){
      console.log("Load error:",err)
    }
  }

  useEffect(()=>{
    loadRequests()
  },[])

  const getLocation = () => {
    if(!navigator.geolocation){
      alert("Location not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
        alert("Location captured successfully")
      },
      ()=>{
        alert("Please allow location access")
      }
    )
  }

  const createRequest = async () => {

    if(selected.length===0) return alert("Select waste type")
    if(!quantity) return alert("Enter quantity")
    if(!address) return alert("Enter address")
    if(!pickupDate) return alert("Select pickup date")
    if(!phone) return alert("Enter phone")

    if(!navigator.geolocation){
      alert("Location not supported")
      return
    }

    navigator.geolocation.getCurrentPosition(async (position)=>{

      try{

        const formData = new FormData()
        formData.append("waste_type", selected.join(", "))
        formData.append("quantity", quantity)
        formData.append("address", address)
        formData.append("pickup_date", pickupDate)
        formData.append("phone", phone)

        if(image){
          formData.append("waste_image", image, image.name)
        }

        formData.append("latitude", position.coords.latitude)
        formData.append("longitude", position.coords.longitude)

        await api.post("waste/create/", formData)

        setSelected([])
        setQuantity("")
        setAddress("")
        setPickupDate("")
        setPhone("")
        setImage(null)

        loadRequests()
        alert("Request sent with location")

      }catch(err){
        console.log(err.response?.data)
        alert("Error sending request")
      }

    }, ()=>{
      alert("Please allow location access")
    })
  }

  const deleteRequest = async(id)=>{
    if(!window.confirm("Cancel this request?")) return
    try{
      await api.delete(`waste/delete/${id}/`)
      loadRequests()
    }catch(err){
      alert("Failed to cancel request")
    }
  }

  const logout = ()=>{
    localStorage.removeItem("token")
    navigate("/")
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-50 to-white p-4 md:p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700 tracking-wide text-center md:text-left">
            Waste Pickup Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow font-semibold"
          >
            Logout
          </button>
        </div>

        {/* CREATE CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10">

          <h2 className="text-lg md:text-xl font-bold text-emerald-700 mb-5">
            Create Pickup Request
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {wasteTypes.map(type=>(
              <label key={type}
                className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition
                ${selected.includes(type)
                  ? "bg-emerald-100 border-emerald-400"
                  : "border-gray-300 hover:border-emerald-400"}`}>
                <input type="checkbox"
                  checked={selected.includes(type)}
                  onChange={()=>toggleType(type)}
                  className="mr-2"/>
                {type}
              </label>
            ))}
          </div>

          <input placeholder="Quantity" value={quantity}
            onChange={e=>setQuantity(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"/>

          <textarea placeholder="Pickup address"
            value={address}
            onChange={e=>setAddress(e.target.value)}
            rows="3"
            className="w-full p-3 mb-4 border rounded-lg"/>

          <button onClick={getLocation}
            className="mb-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow">
            Use My Location
          </button>

          <input placeholder="Phone Number"
            value={phone}
            onChange={e=>setPhone(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"/>

          <input type="file" accept="image/*"
            onChange={e=>setImage(e.target.files[0])}
            className="mb-4"/>

          <input type="datetime-local"
            value={pickupDate}
            onChange={e=>setPickupDate(e.target.value)}
            className="w-full p-3 mb-5 border rounded-lg"/>

          <button onClick={createRequest}
            className="w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg
            bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600">
            Send Pickup Request
          </button>
        </div>

        {/* REQUEST LIST */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

          <h2 className="text-lg md:text-xl font-bold text-emerald-700 mb-5">
            Your Requests
          </h2>

          {requests.length===0 ? (
            <p className="text-gray-500">No requests yet</p>
          ) : (
            requests.map(r=>(
              <div key={r.id}
                className="border rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition">

                <div className="font-semibold text-lg text-emerald-700">
                  {r.waste_type}
                </div>

                <p className="text-sm text-gray-600">Quantity: {r.quantity}</p>
                <p className="text-sm text-gray-600">Address: {r.address}</p>

                {r.phone && (
                  <p className="text-sm text-gray-600">Phone: {r.phone}</p>
                )}

                {r.pickup_date && (
                  <p className="text-sm text-gray-600">
                    Pickup Time: {new Date(r.pickup_date).toLocaleString()}
                  </p>
                )}

                {/* STATUS */}
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold text-white
                  ${r.status==="pending" && "bg-yellow-500"}
                  ${r.status==="approved" && "bg-emerald-500"}
                  ${r.status==="assigned" && "bg-sky-500"}
                  ${r.status==="completed" && "bg-blue-600"}`}>
                  {r.status?.toUpperCase()}
                </span>

                {/* collector info */}
                {r.collector_name && (
                  <div className="mt-3 p-3 bg-sky-50 border rounded-lg">
                    <p className="font-semibold text-sky-700">
                      Collector Assigned
                    </p>
                    <p>Name: {r.collector_name}</p>
                    <p>Email: {r.collector_email}</p>
                    {r.collector_phone && <p>Phone: {r.collector_phone}</p>}
                  </div>
                )}

                {/* IMAGE */}
                {r.waste_image && (
                  <img src={r.waste_image}
                    className="w-40 h-40 mt-3 object-cover rounded-lg border shadow"/>
                )}

                {/* CANCEL */}
                <div>
                  <button onClick={()=>deleteRequest(r.id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded shadow">
                    Cancel Request
                  </button>
                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  )
}