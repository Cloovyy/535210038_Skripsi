'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Berita() {
  const [beritaNBA, setBeritaNBA] = useState([]);

  useEffect(() => {
    // Ambil berita dari localStorage
    const storedBerita = localStorage.getItem('beritaNBA');
    if (storedBerita) {
      setBeritaNBA(JSON.parse(storedBerita));
    }
  }, []);

  return (
    <main className="flex min-h-screen">
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">All NBA News</h2>
        <nav>
          <ul>
            <li className="mb-2 p-2 bg-[#D9D9D9] rounded-[15px]">
              <a href="/home" className="hover:underline block text-center">Back to Home</a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {beritaNBA.length > 0 ? (
            beritaNBA.map((berita, idx) => (
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
            ))
          ) : (
            <p>There is no NBA news yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
