'use client';

import { CircularProgress, Dialog, DialogContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';


export default function Player() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    weight: '',
    handLength: '',
    handWidth: '',
    standingReach: '',
    wingspan: '',
    heightWoShoes: '',
    heightWShoes: '',
  });

  const [results, setResults] = useState([]);

  // Modal Loading
  const [isLoading, setIsLoading] = useState(false);

  const [excelData, setExcelData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); 
  const handleDownloadExcel = (results) => {
    const worksheet = XLSX.utils.json_to_sheet(results);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'PredictionResults.xlsx');
  };
  const [searchTerm, setSearchTerm] = useState('');

   // Function to handle Excel file upload
   const processExcel = async () => {
    var file=document.getElementById("test").files;
    console.log(file);
    if (file.length == 0) {
      console.log(2)
      setErrorMessage('Please upload an Excel file');
      return;
    }
 var excelFile=file[0];
  try {
    setIsLoading(true);
    const data = await excelFile.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const mappedRow = {
        name: row.PLAYER || '',
        position: row.POS || '',
        weight: row.WEIGHT || '',
        handLength: row.HANDLENGTH || '',
        handWidth: row.HANDWIDTH || '',
        standingReach: row.STANDINGREACH || '',
        wingspan: row.WINGSPAN || '',
        heightWoShoes: row.HEIGHTWOSHOES || '',
        heightWShoes: row.HEIGHTWSHOES || '',
      }
      const response = await fetch('/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mappedRow),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const json_result = JSON.parse(result);

      const newResult = {
          name: row.PLAYER,
          position: row.POS,
          result: json_result.message,
      };

      setIsLoading(false);
      setResults((prevResults) => [...prevResults, newResult]);


    }
  } catch (error) {
    console.error('Error processing Excel file:', error);
    setIsLoading(false);
    setErrorMessage('Failed to process Excel file');
  }
};

// Fungsi untuk menangani perubahan input pencarian
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};

// Filter hasil berdasarkan nama pemain
const filteredResults = results.filter((result) =>
  result.name.toLowerCase().includes(searchTerm.toLowerCase())
);



  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'weight' || name === 'handLength' || name === 'handWidth' || 
         name === 'standingReach' || name === 'wingspan' || 
         name === 'heightWoShoes' || name === 'heightWShoes') && value.length > 3) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
  
    // Validasi: pastikan semua field diisi
    const isAllFieldsFilled = Object.values(formData).every((value) => value.trim() !== '');
    if (!isAllFieldsFilled) {
      setErrorMessage('Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        const json_result = JSON.parse(result);
  
        const newResult = {
            name: formData.name,
            position: formData.position,
            result: json_result.message,
        };
  
        setIsLoading(false);
        setResults((prevResults) => [...prevResults, newResult]);
  
        // Clear form data after saving
        setFormData({
            name: '',
            position: '',
            weight: '',
            handLength: '',
            handWidth: '',
            standingReach: '',
            wingspan: '',
            heightWoShoes: '',
            heightWShoes: '',
        });
  
        setErrorMessage(''); // Reset error message
    } catch (error) {
      setIsLoading(false);
        console.error('Prediction failed:', error);
    }
  };

  const handleExcelClick = () => {
    const file = '/dataset.xlsx'; // Path ke file Excel 
    fetch(file)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const wb = XLSX.read(buffer, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        setExcelData(data);
        setModalOpen(true); 
      })
      .catch((error) => console.error('Error reading Excel file:', error));
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <main className="flex min-h-screen">
      <aside className="w-64 bg-[#17408B] p-4 text-white">
        <h2 className="text-2xl font-semibold mb-4">Prediction</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <button onClick={handleExcelClick} className="hover:underline">Dataset</button>
            </li>
            <li className="mb-2">
              <a href="/home" className="hover:underline">Back</a>
            </li>
          </ul>
        </nav>
      </aside>

       

      <div className="flex-grow flex flex-col items-start justify-start bg-white p-4">
        <h1 className="text-2xl font-bold">Player Success Prediction Feature</h1>
        <h2 className="text-lg font-bold">Player Statistics Input</h2>

         {/* Pesan Kesalahan */}
        <div className="w-full border border-black mt-4 rounded-[25px] bg-[#F6F6F6] p-4">
          <form className="grid grid-cols-2 gap-2" onSubmit={handleSave}>
            <div className="flex items-center mb-2 col-span-2">
              <label className="w-32 text-sm">Name</label>
              <span className="mx-2">:</span>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                maxLength={50}
              />
            </div>

            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Position</label>
              <span className="mx-2">:</span>
              <select 
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow"
              >
                <option value="">Choose Position</option>
                <option value="C">C (Center)</option>
                <option value="F">F (Forward)</option>
                <option value="G">G (Guard)</option>
              </select>
            </div>

            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Weight</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> kg
            </div>

            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Hand Length</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="handLength"
                value={formData.handLength}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>
            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Hand Width</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="handWidth"
                value={formData.handWidth}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>

            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Standing Reach</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="standingReach"
                value={formData.standingReach}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>
            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Wingspan</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="wingspan"
                value={formData.wingspan}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>

            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Height W/O Shoes</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="heightWoShoes"
                value={formData.heightWoShoes}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>
            <div className="flex items-center mb-2">
              <label className="w-32 text-sm">Height W/ Shoes</label>
              <span className="mx-2">:</span>
              <input 
                type="number" 
                name="heightWShoes"
                value={formData.heightWShoes}
                onChange={handleChange}
                className="border p-1 text-sm flex-grow" 
                min={0}
                maxLength={3}
              /> cm
            </div>

            <div className="col-span-2 flex justify-center">
              <button className="bg-[#17408B] text-white py-1 px-4 text-sm rounded" type="submit">Save</button>
            </div>
          </form>
        </div>
        
           {/* Excel Input */}
           <div className="text-red-500 mb-4">{errorMessage}</div>
           <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold mb-2">Excel Input</h3>
          <input type="file" accept=".xlsx, .xls" id="test" className="mb-4" />
          <button type="button" onClick={processExcel} className="bg-blue-500 text-white px-4 py-2 rounded">
            Process Excel
          </button>
        </div>

     {/* Hasil dari Input */}
     <div className="mt-6 w-full">
  <div className="flex justify-between items-center">
    <h2 className="text-xl font-semibold">Results</h2>
    <button
      onClick={() => setResults([])} // Menghapus semua hasil
      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
    >
      Delete All
    </button>
  </div>

  <button 
  onClick={() => handleDownloadExcel(results)} 
  className="text-blue-500 underline" // Menambahkan warna biru dan garis bawah
>
  Download Excel
</button>

<div>
  <label style={{ marginRight: '15px' }}>
    Search Player
  </label>
  <input
    type="text"
    placeholder="Search by Name"
    value={searchTerm}
    onChange={handleSearchChange}
    className="border p-1 text-sm flex-grow mb-4"
    style={{ borderColor: 'black' }} // Mengubah warna border menjadi hitam
  />
</div>

 {filteredResults.map((result, index) => (
    <div key={index} className="w-full flex justify-between items-center border border-black mt-2 p-4 rounded-[25px] bg-[#F6F6F6]">
      <div>
        <p><strong>Name:</strong> {result.name}</p>
        <p><strong>Position:</strong> {result.position}</p>
      </div>
      <div>
        <p><strong>Results:</strong> {result.result}</p>
      </div>
      {/* Tombol untuk menghapus hasil individual */}
      <button
        onClick={() =>
          setResults((prevResults) => prevResults.filter((_, i) => i !== index))
        }
        className="text-red-500 hover:text-red-700"
      >
        &#10060;
      </button>
    </div>
  ))}
</div>

      </div>
      {/* Modal untuk Menampilkan Data Excel */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-3/4">
            <h2 className="text-xl font-semibold mb-4">Dataset</h2>
            <div className="max-h-96 overflow-y-auto"> {/* Div untuk area scrollable */}
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    {excelData.length > 0 && Object.keys(excelData[0]).map((key) => (
                      <th key={key} className="border border-gray-300 px-4 py-2 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.length > 0 ? (
                    excelData.map((row, index) => (
                      <tr key={index} className="border border-gray-300">
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key} className="border border-gray-300 px-4 py-2">{value}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={Object.keys(excelData[0] || {}).length} className="border border-gray-300 px-4 py-2 text-center">There is no dataset</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="bg-[#17408B] text-white py-1 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Loading */}
      <Dialog fullWidth open={isLoading}>
         <DialogContent>
                     <Typography
                         sx={{ mb: 1, mt: 1, fontWeight: "bold" }}
                     >
                         Please Wait
                     </Typography>
                     <CircularProgress color="primary" />
         </DialogContent>
      </Dialog>
    </main>
  );
}
