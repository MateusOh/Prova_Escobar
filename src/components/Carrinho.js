import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Carrinho = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [nomeCliente, setNomeCliente] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCarrinho(carrinhoSalvo);
  }, []);

  const removerProduto = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const finalizarCompra = async () => {
    if (!nomeCliente.trim()) {
      alert("Por favor, informe seu nome para finalizar a compra.");
      return;
    }

    const usuario = localStorage.getItem("usuario");
    const dataAtual = new Date().toISOString().split("T")[0];

    const venda = {
      nomeCliente,
      usuario,
      data: dataAtual,
      produtos: carrinho.map((item) => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
      })),
    };

    try {
      const res = await fetch("https://backend-completo.vercel.app/app/venda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });

      if (!res.ok) {
        throw new Error("Erro ao finalizar a compra");
      }

      alert("Compra finalizada com sucesso!");
      localStorage.removeItem("carrinho");
      navigate("/agradecimento");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="carrinho-container">
      <h1>Carrinho de Compras</h1>
      {carrinho.length === 0 ? (
        <div className="carrinho-vazio">
          <p>Seu carrinho está vazio.</p>
          <button className="btn-primary" onClick={() => navigate("/produtos")}>
            Voltar às Compras
          </button>
        </div>
      ) : (
        <>
          {carrinho.map((item, index) => (
            <div key={index} className="carrinho-item">
              {item.imagem && (
                <img src={item.imagem} alt={item.nome} />
              )}
              <div className="carrinho-item-info">
                <h3>{item.nome}</h3>
                <p>Preço: R$ {item.preco.toFixed(2)}</p>
                <p>Quantidade: {item.quantidade}</p>
                <button 
                  className="btn-primary btn-secondary"
                  onClick={() => removerProduto(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
          
          <div className="carrinho-total">
            <p>Total: R$ {calcularTotal().toFixed(2)}</p>
          </div>

          <div className="carrinho-checkout">
            <label className="input-label">Seu Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="input-nome"
            />
            <button className="btn-primary" onClick={finalizarCompra}>
              Finalizar Compra
            </button>
            <button 
              className="btn-primary btn-secondary"
              onClick={() => navigate("/produtos")}
            >
              Continuar Comprando
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrinho;