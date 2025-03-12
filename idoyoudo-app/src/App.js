import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Wedplan from './wedplan';
import Calendar from './calendar';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pentru pagina de logare */}
         <Route path="/" element={<Login onLogin={() => console.log('Utilizator logat')} />} />
        <Route path="/login" element={<Login onLogin={() => console.log('Utilizator logat')} />} />
        
        {/* Alte rute pot fi adăugate aici */}
        <Route path="/wedplan" element={<Wedplan />} />"
        <Route path="/calendar" element={<Calendar />} />"
      </Routes>
    </Router>
  );
}

export default App;
