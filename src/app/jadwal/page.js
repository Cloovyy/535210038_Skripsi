'use client';

import { useEffect, useState } from 'react';

export default function Jadwal() {
  const [jadwalPertandingan, setJadwalPertandingan] = useState([]);

  useEffect(() => {
    // Ambil jadwal pertandingan dari localStorage
    const storedJadwal = localStorage.getItem('jadwalPertandingan');
    if (storedJadwal) {
      setJadwalPertandingan(JSON.parse(storedJadwal));
    }
  }, []);

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">All Match Schedules</h2>
        <nav>
          <ul>
          <li className="mb-2 p-2 bg-[#D9D9D9] rounded-[15px]">
              <a href="/home" className="hover:underline block text-center">Back to Home</a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-4">
        <div className="grid grid-cols-3 gap-[15px]">
          {jadwalPertandingan.length > 0 ? (
            jadwalPertandingan.map((jadwal, idx) => (
              <div key={idx} className="bg-[#e52534] p-2 rounded-[15px] text-center text-white">
                <p className="text-sm">{jadwal.tanggal}</p>
                <p className="text-sm">{jadwal.tim_a} vs {jadwal.tim_b}</p>
                <p className="text-sm">{jadwal.jam}</p>
              </div>
            ))
          ) : (
            <p>There is no match schedule yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
