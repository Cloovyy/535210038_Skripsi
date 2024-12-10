'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [jadwalPertandingan, setJadwalPertandingan] = useState([]);
  const [beritaNBA, setBeritaNBA] = useState([]);
  const router = useRouter(); // Inisialisasi useRouter

  useEffect(() => {
    // Ambil jadwal pertandingan dari localStorage
    const storedJadwal = localStorage.getItem('jadwalPertandingan');
    if (storedJadwal) {
      setJadwalPertandingan(JSON.parse(storedJadwal));
    }

    // Ambil berita dari localStorage
    const storedBerita = localStorage.getItem('beritaNBA');
    if (storedBerita) {
      setBeritaNBA(JSON.parse(storedBerita));
    }
  }, []);

  // Fungsi untuk menangani klik "Lihat Semua Jadwal"
  const handleLihatSemuaJadwal = () => {
    router.push('/jadwal'); // Arahkan ke halaman jadwal
  };

  // Fungsi untuk menangani klik "Lihat Semua Berita"
  const handleLihatSemuaBerita = () => {
    router.push('/berita'); // Arahkan ke halaman berita
  };

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">Home</h2>
        <nav>
          <ul>
            <li className="mb-2 p-2 bg-[#D9D9D9] rounded-[15px]">
              <a href="/player" className="hover:underline block text-center">Player Predictions Page</a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:underline">Log out</a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold mb-4">Match Schedule</h2>
        <div className="grid grid-cols-3 gap-[15px]">
          {jadwalPertandingan.length > 0 ? (
            <>
              {jadwalPertandingan.slice(0, 6).map((jadwal, idx) => (
                <div key={idx} className="bg-[#e52534] p-2 rounded-[15px] text-center text-white">
                  <p className="text-sm">{jadwal.tanggal}</p>
                  <p className="text-sm">{jadwal.tim_a} vs {jadwal.tim_b}</p>
                  <p className="text-sm">{jadwal.jam}</p>
                </div>
              ))}
              {jadwalPertandingan.length > 6 && (
                <button
                  onClick={handleLihatSemuaJadwal}
                  className="mt-4 text-blue-500 underline text-left"
                >
                  See All Schedules
                </button>
              )}
            </>
          ) : (
            <p>There is no match schedule yet.</p>
          )}
        </div>

        <h3 className="text-xl font-semibold mt-8">NBA News</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {beritaNBA.length > 0 ? (
            <>
              {beritaNBA.slice(0, 4).map((berita, idx) => (
             <div key={idx} className="bg-[#17408B] p-4 rounded-[25px] text-white text-center">
                  <h4 className="text-lg font-semibold">{berita.judul}</h4>
                  <p className="text-sm">{berita.tanggal}</p>
                  <Image
                    src={berita.imgSrc}
                    alt={berita.judul}
                    layout="responsive"
                    width={250}
                    height={150}
                    objectFit="cover"
                    className="rounded-md mt-2"
                  />
                  <a href={berita.link} target="_blank" rel="noopener noreferrer" className="text-white underline mt-2 block">
                    Read More
                  </a>
                </div>
              ))}
              {beritaNBA.length > 4 && (
                <button
                  onClick={handleLihatSemuaBerita}
                  className="mt-4 text-blue-500 underline text-left"
                >
                  See All News
                </button>
              )}
            </>
          ) : (
            <p>There is no NBA news yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
