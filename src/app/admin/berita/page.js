'use client';
import { useEffect, useState } from 'react';

export default function Admin() {
  const [judulBerita, setJudulBerita] = useState('');
  const [linkBerita, setLinkBerita] = useState('');
  const [imgBerita, setImgBerita] = useState('');
  const [beritaNBA, setBeritaNBA] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Load data berita from localStorage
  useEffect(() => {
    const storedBerita = localStorage.getItem('beritaNBA');
    if (storedBerita) {
      setBeritaNBA(JSON.parse(storedBerita));
    }
  }, []);

  const handleSubmitBerita = (e) => {
    e.preventDefault();
    const beritaBaru = { judul: judulBerita, link: linkBerita, imgSrc: imgBerita, tanggal: new Date().toLocaleDateString() };
    const updatedBerita = [...beritaNBA, beritaBaru];
    setBeritaNBA(updatedBerita);
    localStorage.setItem('beritaNBA', JSON.stringify(updatedBerita));
    setJudulBerita('');
    setLinkBerita('');
    setImgBerita('');
  };

  const openDeleteModal = (index) => {
    setNewsToDelete(index);
    setIsModalOpen(true);
  };

  const confirmDeleteBerita = () => {
    const updatedBerita = beritaNBA.filter((_, idx) => idx !== newsToDelete);
    setBeritaNBA(updatedBerita);
    localStorage.setItem('beritaNBA', JSON.stringify(updatedBerita));
    setIsModalOpen(false);
    setNewsToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewsToDelete(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgBerita(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBerita = beritaNBA.filter((berita) =>
    berita.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/admin" className="hover:underline">Schedule Input</a>
            </li>
            <li className="mb-2">
              <a href="/" className="hover:underline">Log out</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">NBA News Input</h2>
          <form onSubmit={handleSubmitBerita}>
            <div className="mb-4">
              <label className="block text-gray-700">News Title</label>
              <input
                type="text"
                value={judulBerita}
                onChange={(e) => setJudulBerita(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the headline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">News Links</label>
              <input
                type="url"
                value={linkBerita}
                onChange={(e) => setLinkBerita(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter the news link"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload News Images</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save News
            </button>
          </form>

          {/* Search Bar */}
          <div className="mt-8">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Search news by title"
            />
          </div>

          {/* Display Saved News */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Saved News</h3>
            {filteredBerita.length > 0 ? (
              <ul>
                {filteredBerita.map((berita, index) => (
                  <li key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold">{berita.judul}</h4>
                    <p>Date: {berita.tanggal}</p>
                    <img src={berita.imgSrc} alt={berita.judul} className="w-full h-auto mt-2 rounded" />
                    <a href={berita.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 inline-block">
                      Read more
                    </a>
                    <button
                      onClick={() => openDeleteModal(index)}
                      className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      Delete News
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No news found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation*/}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h4 className="text-xl font-semibold mb-4">Confirm Deletion</h4>
            <p>Are you sure you want to delete this news item?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 p-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBerita}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
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
