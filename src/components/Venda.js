import React, { useState, useEffect } from "react";

const urlBase = "https://backend-completo.vercel.app/app/venda";

const Venda = () => {
  const [vendas, setVendas] = useState([]);
  const [erro, setErro] = useState("");
  const token = localStorage.getItem("token");

  const buscarVendas = async () => {
    setErro("");
    try {
      const res = await fetch(urlBase, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar vendas");
      const data = await res.json();
      setVendas(data);
    } catch (err) {
      setErro(err.message);
    }
  };

  const excluirVenda = async (id) => {
    setErro("");
    try {
      const res = await fetch(urlBase, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Erro ao excluir venda");
      alert("Venda excluída!");
      buscarVendas();
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      buscarVendas();
    } else {
      setErro("Token não encontrado. Faça login.");
    }
  }, [token]);

  return (
    <div className="vendas-container">
      <h1>Vendas</h1>

      {erro && <p className="error-message">{erro}</p>}

      {vendas.length === 0 ? (
        <p className="feedback-message">Nenhuma venda encontrada.</p>
      ) : (
        <ul className="categoria-lista">
          {vendas.map((venda) => (
            <li key={venda._id} className="venda-item">
              <div className="venda-header">
                <div className="venda-cliente">
                  <strong>Cliente:</strong> {venda.nomeCliente}
                </div>
                <div className="venda-data">
                  <strong>Data da Venda:</strong>{" "}
                  {new Date(venda.data).toLocaleDateString()}
                </div>
                <div>
                  <strong>Usuário:</strong> {venda.usuario}
                </div>
              </div>

              <div className="venda-produtos-lista">
                <strong>Produtos:</strong>
                {venda.produtos.map((p, i) => (
                  <div key={i} className="venda-produto">
                    <span>
                      <strong>Nome:</strong> {p.nome}
                    </span>
                    <span>
                      <strong>Qtd:</strong> {p.quantidade}
                    </span>
                    <span>
                      <strong>Preço:</strong> R$ {p.preco.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => excluirVenda(venda._id)}
                className="btn-admin btn-danger-admin"
              >
                Excluir Venda
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Venda;