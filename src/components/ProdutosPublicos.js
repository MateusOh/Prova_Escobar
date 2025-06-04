import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProdutosPublicos = () => {
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const usuario = localStorage.getItem("usuario");
  const urlBase = `https://backend-completo.vercel.app/app/produtos/${usuario}`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  // Função para formatar preços grandes
  const formatarPreco = (preco) => {
    // Converte para número caso seja string
    const precoNumero = typeof preco === 'string' ? parseFloat(preco) : preco;
    
    // Formata o número usando o formato brasileiro
    return precoNumero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const res = await fetch(urlBase);
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();

        if (!Array.isArray(data)) {
          setErro("Formato inesperado da resposta da API");
          return;
        }

        setProdutos(data);
      } catch (err) {
        setErro("Erro ao carregar produtos: " + err.message);
      }
    };

    if (usuario) {
      buscarProdutos();
    } else {
      setErro("Usuário não encontrado. Faça login.");
    }
  }, [urlBase, usuario]);

  const adicionarAoCarrinho = (produto) => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinhoAtual.push({ ...produto, quantidade: 1 });
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    alert("Produto adicionado ao carrinho!");
  };

  const verDetalhes = (produto) => {
    localStorage.setItem("produtoDetalhes", JSON.stringify(produto));
    navigate(`/detalhes/${produto._id}`);
  };

  return (
    <div className="produtos-publicos">
      <div className="welcome-banner">
        <h1>Bem Vindo à Mateus Motors</h1>
        <p>Encontre os melhores produtos para seu veículo</p>
      </div>
      <div className="header-buttons">
        <button className="btn-primary" onClick={() => navigate('/carrinho')}>Ver Carrinho</button>
      </div>
      <h2 className="section-title">Produtos Disponíveis</h2>
      {erro && <p className="error-message">{erro}</p>}
      <div className="produtos-grid">
        {produtos.map((produto) => (
          <div key={produto._id} className="produto-card">
            {produto.imagem && (
              <img src={produto.imagem} alt={produto.nome} />
            )}
            <div className="produto-info">
              <h3>{produto.nome}</h3>
              <p>{produto.descricao}</p>
              <p>Categoria: {produto.categoria}</p>
              <div className="produto-preco">
                {formatarPreco(produto.preco)}
              </div>
              <button className="btn-primary" onClick={() => adicionarAoCarrinho(produto)}>
                Adicionar ao Carrinho
              </button>
              <button className="btn-primary btn-secondary" onClick={() => verDetalhes(produto)}>
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="logout-button">
        <button className="btn-primary btn-secondary btn-small" onClick={handleLogout}>Sair</button>
      </div>
    </div>
  );
};

export default ProdutosPublicos;
