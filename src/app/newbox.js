'use client'; // This component uses client-side rendering

import Image from 'next/image';

const NewBoxes = () => {
  const newDynamicBoxes = [
    {
      imgSrc: '/new-box1.png', // Make sure this path is correct
      bgColor: 'bg-blue-700',
      altText: 'New Box 1',
    },
    {
      imgSrc: '/new-box2.png', // Ensure this path is correct
      bgColor: 'bg-gray-700',
      altText: 'New Box 2',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">New Boxes</h2>
      <div className="grid grid-cols-1 gap-[25px]">
        {newDynamicBoxes.map((box, idx) => (
          <div key={idx} className={`p-4 ${box.bgColor} text-white rounded-[25px]`}>
            <Image
              src={box.imgSrc}
              alt={box.altText}
              width={180}
              height={100}
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBoxes;
