'use client';

import { useEffect, useState } from 'react';

export default function Admin() {
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [timA, setTimA] = useState('');
  const [timB, setTimB] = useState('');
  const [jadwalPertandingan, setJadwalPertandingan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Load schedule data from localStorage on page load
  useEffect(() => {
    const storedJadwal = localStorage.getItem('jadwalPertandingan');
    if (storedJadwal) {
      setJadwalPertandingan(JSON.parse(storedJadwal));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new schedule
    const jadwalBaru = { tanggal, jam, tim_a: timA, tim_b: timB };

    // Update state with the new schedule
    const updatedJadwal = [...jadwalPertandingan, jadwalBaru];
    setJadwalPertandingan(updatedJadwal);

    // Save to localStorage so data can be accessed on the Home page
    localStorage.setItem('jadwalPertandingan', JSON.stringify(updatedJadwal));

    // Clear form after saving
    setTanggal('');
    setJam('');
    setTimA('');
    setTimB('');
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedJadwal = jadwalPertandingan.filter((_, idx) => idx !== deleteIndex);
      setJadwalPertandingan(updatedJadwal);
      localStorage.setItem('jadwalPertandingan', JSON.stringify(updatedJadwal));
      setDeleteIndex(null);
    }
    setShowModal(false);
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
    setShowModal(false);
  };

  // Filtered schedules based on search term
  const filteredJadwal = jadwalPertandingan.filter((jadwal) =>
    jadwal.tanggal.includes(searchTerm) ||
    jadwal.jam.includes(searchTerm) ||
    jadwal.tim_a.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.tim_b.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/admin/berita" className="hover:underline">News Input</a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:underline">Log out</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Form Input */}
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Input Match Schedule</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Time</label>
              <input
                type="time"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Team A</label>
              <input
                type="text"
                value={timA}
                onChange={(e) => setTimA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Team A name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Team B</label>
              <input
                type="text"
                value={timB}
                onChange={(e) => setTimB(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter Team B name"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save Schedule
            </button>
          </form>

          {/* Search Input */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by date, time, or team"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Display Saved Schedules */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Match Schedule</h3>
            {filteredJadwal.length > 0 ? (
              <ul>
                {filteredJadwal.map((jadwal, index) => (
                  <li key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <p>{jadwal.tanggal} - {jadwal.jam}</p>
                    <p>{jadwal.tim_a} vs {jadwal.tim_b}</p>
                    <button
                      onClick={() => handleDelete(index)}
                      className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Delete Schedule
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedules found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this schedule?</h2>
            <div className="flex justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
