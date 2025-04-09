// src/App.jsx
import React, { useState } from 'react';
import SlotMachine from './components/SlotMachine';

const App = () => {
  const [result, setResult] = useState(null);

  const items = [
    { name: 'เกลือ', image: 'https://yourlink.com/salt.png' },
    { name: 'ปืนเทพเจ้า', image: 'https://yourlink.com/godgun.png' },
    { name: 'ดาบล่องหน', image: 'https://yourlink.com/invisibleblade.png' },
    { name: 'ปีกเทพเทวดา', image: 'https://yourlink.com/angelwings.png' },
    { name: 'โล่กันเวทย์', image: 'https://yourlink.com/magicshield.png' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <SlotMachine items={items} onResult={setResult} />
      {result && (
        <div className="text-white mt-4 text-xl font-bold">
          คุณได้รับ: {result.name}
        </div>
      )}
    </div>
  );
};

export default App;


// src/components/SlotMachine.jsx
import React, { useState } from 'react';
import './SlotMachine.css';

const SlotMachine = ({ items, onResult }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningItems, setSpinningItems] = useState([null, null, null]);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    let interval = null;
    const duration = 2000; // ms
    const intervalTime = 100;
    const start = Date.now();

    interval = setInterval(() => {
      const newItems = [
        items[Math.floor(Math.random() * items.length)],
        items[Math.floor(Math.random() * items.length)],
        items[Math.floor(Math.random() * items.length)]
      ];
      setSpinningItems(newItems);
      if (Date.now() - start >= duration) {
        clearInterval(interval);
        const result = newItems[1];
        setSpinningItems(newItems);
        onResult(result);
        setIsSpinning(false);
      }
    }, intervalTime);
  };

  return (
    <div className="slot-container">
      <div className="flex gap-2">
        {spinningItems.map((item, index) => (
          <div className="slot-frame" key={index}>
            <div className="slot-reel">
              {item && (
                <img
                  src={item.image}
                  alt={item.name}
                  className={`slot-item ${index === 1 ? 'highlight' : ''}`}
                  width="80"
                  height="80"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="spin-button mt-6" onClick={spin} disabled={isSpinning}>
        {isSpinning ? 'กำลังหมุน...' : 'หมุนสุ่ม!'}
      </button>
    </div>
  );
};

export default SlotMachine;


// src/index.css (เพิ่มท้ายไฟล์หรือตั้งใหม่ได้เลย)
.slot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slot-frame {
  width: 120px;
  height: 300px;
  overflow: hidden;
  border: 4px solid gold;
  border-radius: 12px;
  background: #1a1a1a;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px gold;
}

.slot-reel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.slot-item {
  margin: 4px auto;
  transition: transform 0.2s;
}

.slot-item.highlight {
  filter: drop-shadow(0 0 10px lime);
  transform: scale(1.1);
}

.spin-button {
  background-color: gold;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 0 10px gold;
  transition: transform 0.2s;
}

.spin-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
