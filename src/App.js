import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Admin from './components/Admin';
import ProdutosPublicos from './components/ProdutosPublicos';
import Carrinho from './components/Carrinho';
import DetalhesProduto from './components/DetalhesProduto';
import Agradecimento from './components/Agradecimento';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route path="/produtos" element={<ProdutosPublicos />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/detalhes/:id" element={<DetalhesProduto />} />
        <Route path="/agradecimento" element={<Agradecimento />} />
      </Routes>
    </Router>
  );
}

export default App;
