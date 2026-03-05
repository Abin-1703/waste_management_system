export default function About(){
  return(
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-50 to-white px-6 py-16">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-12">

        <h1 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">
          About Smart Waste Pickup Platform
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          The Smart Waste Pickup Platform is a modern digital solution designed to
          simplify waste collection management for cities, municipalities, and
          communities. The system enables citizens to schedule waste pickups,
          monitor request status in real-time, and communicate efficiently with
          collection teams.
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          Traditional waste management often suffers from delays, lack of
          coordination, and poor tracking systems. Our platform addresses these
          challenges by providing a centralized system that connects residents,
          collectors, and administrators into one seamless workflow.
        </p>

        {/* OBJECTIVES */}
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
          Key Objectives
        </h2>

        <ul className="space-y-2 text-gray-600 mb-10">
          <li>✔ Provide an easy interface for scheduling waste collection</li>
          <li>✔ Enable real-time tracking of pickup requests</li>
          <li>✔ Improve communication between citizens and collectors</li>
          <li>✔ Reduce environmental pollution through organized disposal</li>
          <li>✔ Support data-driven decisions for municipal authorities</li>
        </ul>

        {/* TECHNOLOGY */}
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
          Technology Used
        </h2>

        <p className="text-gray-600 leading-relaxed mb-10">
          This platform is built using modern full-stack technologies. The frontend
          is developed with <b className="text-emerald-700">React</b> for fast and responsive user interfaces,
          while the backend uses <b className="text-emerald-700">Django REST Framework</b> to provide secure API
          endpoints, authentication, and database management.
        </p>

        {/* VISION */}
        <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
          Project Vision
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Our vision is to contribute toward smarter cities and sustainable urban
          development by leveraging technology to improve everyday civic services.
          With scalable architecture and modular design, the system can be adapted
          for municipalities of any size.
        </p>

      </div>

    </div>
  )
}