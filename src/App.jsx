
import React, { useState, useEffect } from 'react';
import SlotMachine from './components/SlotMachine';

const BACKEND_URL = 'https://script.google.com/macros/s/AKfycbyQKOv8op0hyOdrSoG2ZhXFiv3PaCYyPNL0HwiLimYtYoz_e86P4wDuUOzhY2iQtExiBA/exec';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(0);
  const [view, setView] = useState('login');
  const [item, setItem] = useState(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminTokens, setAdminTokens] = useState(0);
  const [rates, setRates] = useState([]);

  useEffect(() => {
    fetch(BACKEND_URL + '?action=getrates')
      .then(res => res.json())
      .then(setRates);
  }, []);

  const handleAuth = async (action) => {
    const params = new URLSearchParams({ action, username, password });
    const res = await fetch(BACKEND_URL, { method: 'POST', body: params });
    const result = await res.json();
    if (result.status === 'LoginSuccess') {
      setIsLoggedIn(true);
      setToken(result.token || 0);
      setView(result.role === 'admin' ? 'admin' : 'dashboard');
    } else if (result.status === 'Registered') {
      alert('สมัครสำเร็จ');
      setView('login');
    } else {
      alert(result.status);
    }
  };

  const handleDraw = async () => {
    if (!characterName) return alert('ใส่ชื่อตัวละครก่อน');
    const url = `${BACKEND_URL}?username=${username}&character=${characterName}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data === 'NotEnoughTokens') {
      alert('Token ไม่พอ');
    } else {
      setItem(data.item);
      setToken(data.remainingToken);
    }
  };

  const handleAdminAddToken = async () => {
    const params = new URLSearchParams({
      action: 'addtoken',
      username: adminUsername,
      token: adminTokens,
    });
    const res = await fetch(BACKEND_URL, { method: 'POST', body: params });
    const result = await res.json();
    alert(result.status === 'TokenAdded' ? 'เติมสำเร็จ' : 'ไม่พบผู้ใช้');
  };

  return (
    <div className="text-center space-y-4">
      {view === 'login' && (
        <>
          <h1 className="text-xl">เข้าสู่ระบบ</h1>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('login')}>เข้าสู่ระบบ</button>
          <p>ยังไม่มีบัญชี? <span onClick={() => setView('register')}>สมัคร</span></p>
        </>
      )}

      {view === 'register' && (
        <>
          <h1 className="text-xl">สมัครสมาชิก</h1>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => handleAuth('register')}>สมัคร</button>
          <p>มีบัญชีแล้ว? <span onClick={() => setView('login')}>เข้าสู่ระบบ</span></p>
        </>
      )}

      {view === 'dashboard' && (
        <>
          <h2>🎮 Token คงเหลือ: {token}</h2>
          <input placeholder="ชื่อตัวละคร" value={characterName} onChange={(e) => setCharacterName(e.target.value)} />
          <button onClick={handleDraw}>สุ่มไอเท็ม</button>
          {item && <SlotMachine finalItem={item} />}
          <h3 className="mt-4">📊 อัตราดรอป</h3>
          <ul>
            {rates.map((r, i) => (
              <li key={i}>{r.name} - {r.chance}%</li>
            ))}
          </ul>
          <button onClick={() => { setIsLoggedIn(false); setView('login'); }}>ออก</button>
        </>
      )}

      {view === 'admin' && (
        <>
          <h2>Admin Panel</h2>
          <input placeholder="Username" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
          <input type="number" placeholder="Tokens" value={adminTokens} onChange={(e) => setAdminTokens(e.target.value)} />
          <button onClick={handleAdminAddToken}>เติม Token</button>
          <button onClick={() => { setIsLoggedIn(false); setView('login'); }}>ออก</button>
        </>
      )}
    </div>
  );
}
