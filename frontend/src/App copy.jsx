import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/mock-response')  // Fetch from Laravel API
      .then((res) => res.json())
      .then((json) => setData(json.data))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="bg-blue-500 min-h-screen text-black p-4">
      <h1 className="text-2xl font-bold mb-4">React + Laravel API</h1>

      {error && <p className="text-red-700">Error: {error}</p>}

      {!data ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto bg-white text-black rounded shadow p-4">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">{data.id}</td>
              <td className="border px-4 py-2">{data.name}</td>
              <td className="border px-4 py-2">{data.email}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App
