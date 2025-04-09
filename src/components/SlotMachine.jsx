
import React, { useEffect, useState } from 'react';

const dummyImages = [
  'https://i.imgur.com/1.jpg',
  'https://i.imgur.com/2.jpg',
  'https://i.imgur.com/3.jpg',
  'https://i.imgur.com/4.jpg',
  'https://i.imgur.com/5.jpg',
];

export default function SlotMachine({ finalItem }) {
  const [rolling, setRolling] = useState(true);
  const [images, setImages] = useState(["", "", ""]);

  useEffect(() => {
    let interval = setInterval(() => {
      const randomImages = [
        dummyImages[Math.floor(Math.random() * dummyImages.length)],
        dummyImages[Math.floor(Math.random() * dummyImages.length)],
        dummyImages[Math.floor(Math.random() * dummyImages.length)],
      ];
      setImages(randomImages);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setImages([
        dummyImages[Math.floor(Math.random() * dummyImages.length)],
        `https://imgplaceholder.com/center/${finalItem}`, // Replace with finalItem image URL
        dummyImages[Math.floor(Math.random() * dummyImages.length)],
      ]);
      setRolling(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [finalItem]);

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {images.map((src, idx) => (
        <div key={idx} className={`w-24 h-24 border-4 ${idx === 1 ? 'border-yellow-400' : 'border-gray-600'} rounded-xl overflow-hidden`}>
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}
