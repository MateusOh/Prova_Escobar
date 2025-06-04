import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Produtos from './Produtos';
import Categorias from './Categorias';
import Venda from './Venda';

function Admin() {
  const [telaAtiva, setTelaAtiva] = useState("produtos");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="admin-nav-content">
          <h1>Painel Administrativo</h1>
          <div className="admin-nav-buttons">
            <button 
              className={`nav-btn ${telaAtiva === "produtos" ? "nav-btn-active" : ""}`}
              onClick={() => setTelaAtiva("produtos")}
            >
              Produtos
            </button>
            <button 
              className={`nav-btn ${telaAtiva === "categorias" ? "nav-btn-active" : ""}`}
              onClick={() => setTelaAtiva("categorias")}
            >
              Categorias
            </button>
            <button 
              className={`nav-btn ${telaAtiva === "venda" ? "nav-btn-active" : ""}`}
              onClick={() => setTelaAtiva("venda")}
            >
              Venda
            </button>
            <button 
              className="nav-btn logout-btn"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="admin-main">
        {telaAtiva === "produtos" && <Produtos />}
        {telaAtiva === "categorias" && <Categorias />}
        {telaAtiva === "venda" && <Venda />}
      </main>
    </div>
  );
}

export default Admin;
