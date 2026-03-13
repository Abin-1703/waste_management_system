import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Collector() {

  const [jobs,setJobs] = useState([]);
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("all");
  const [prevJobs, setPrevJobs] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = ()=>{
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {

    const fetchJobs = async () => {
      try{
        const res = await axios.get(
          "http://127.0.0.1:8000/api/waste/collector/",
          { headers:{ Authorization:`Token ${token}` } }
        );

        const newJobs = res.data;

        if(jobs.length){
          const newAssigned = newJobs.filter(
            j => !jobs.some(old => old.id === j.id)
          );

          if(newAssigned.length > 0){
            toast.info("🚛 New pickup assigned to you!");
          }
        }

        setJobs(newJobs);

      }catch(err){
        console.log(err);
      }
    };

    fetchJobs();
    const interval = setInterval(fetchJobs,8000);
    return ()=>clearInterval(interval);

  },[jobs]);

  const markDone = (id)=>{
    axios.patch(`http://127.0.0.1:8000/api/waste/update/${id}/`,{},{
      headers:{ Authorization:`Token ${token}` }
    })
    .then(()=>{
      toast.success("Pickup marked as completed ✅");

      axios.get("http://127.0.0.1:8000/api/waste/collector/",{
        headers:{ Authorization:`Token ${token}` }
      }).then(res=>setJobs(res.data));
    })
    .catch(()=>{
      toast.error("Failed to update request ❌");
    });
  };

  const collector = jobs.length>0 ? jobs[0] : null;
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const pendingJobs = jobs.filter(j => j.status !== "completed").length;

  const filteredJobs = jobs.filter(job=>{
    const matchSearch =
      job.address?.toLowerCase().includes(search.toLowerCase()) ||
      job.waste_type?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter==="all" ||
      (filter==="assigned" && job.status!=="completed") ||
      (filter==="completed" && job.status==="completed");

    return matchSearch && matchFilter;
  });

  return(
    <div className="min-h-screen px-4 md:px-8 py-6 md:py-8 bg-gradient-to-br from-sky-100 via-blue-50 to-green-100">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-slate-800 text-xl md:text-2xl font-semibold">
          Collector Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow font-semibold w-full md:w-auto"
        >
          Logout
        </button>
      </div>

      {/* PROFILE */}
      {collector && (
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg max-w-2xl mb-6 flex items-center gap-4">

          {collector.collector_photo ? (
            <img
              src={collector.collector_photo}
              alt="collector"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-lg">
              {collector.collector_name?.charAt(0)}
            </div>
          )}

          <div>
            <h2 className="font-semibold text-base md:text-lg">{collector.collector_name}</h2>
            <p className="text-gray-500 text-sm">{collector.collector_email}</p>
          </div>

        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Jobs</p>
          <h2 className="text-2xl font-bold">{totalJobs}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed Jobs</p>
          <h2 className="text-2xl font-bold text-green-600">{completedJobs}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Pending Jobs</p>
          <h2 className="text-2xl font-bold text-amber-600">{pendingJobs}</h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search address or waste type..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl bg-white border shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value)}
          className="md:w-56 px-4 py-3 rounded-xl bg-white border shadow focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <option value="all">All Jobs</option>
          <option value="assigned">Assigned</option>
          <option value="completed">Completed</option>
        </select>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

        <table className="min-w-[800px] w-full text-left">

          <thead className="bg-sky-50 text-gray-600 text-sm">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Waste</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredJobs.map((job,index)=>(
              <tr key={job.id} className="border-t hover:bg-sky-50">

                <td className="px-4 py-3 font-medium">{index+1}</td>
                <td className="px-4 py-3">{job.waste_type}</td>
                <td className="px-4 py-3">{job.quantity}</td>
                <td className="px-4 py-3">
                  {new Date(job.pickup_date).toLocaleDateString()}
                </td>

                <td className="px-4 py-3">
                  <div>{job.address}</div>
                  {job.latitude && job.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${job.latitude},${job.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-600 text-xs underline block mt-1"
                    >
                      Open in Google Maps
                    </a>
                  )}
                </td>

                <td className="px-4 py-3">
                  {job.phone ? (
                    <a
                      href={`tel:${job.phone}`}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow"
                    >
                      📞 Call
                    </a>
                  ) : (
                    <span className="text-gray-400">No phone</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {job.waste_image ? (
                    <img
                      src={job.waste_image}
                      className="w-16 h-14 object-cover rounded-lg shadow"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      job.status==="completed"
                        ? "bg-green-500"
                        : job.status==="assigned"
                        ? "bg-sky-500"
                        : job.status==="pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}>
                    {job.status}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {job.status!=="completed" && (
                    <button
                      onClick={()=>markDone(job.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                    >
                      Mark Done
                    </button>
                  )}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}