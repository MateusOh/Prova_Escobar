import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetalhesProduto = () => {
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  // Função para formatar preços grandes
  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  useEffect(() => {
    const buscarProduto = () => {
      // Recupera o produto dos detalhes salvos no localStorage
      const produtoSalvo = localStorage.getItem("produtoDetalhes");
      if (produtoSalvo) {
        setProduto(JSON.parse(produtoSalvo));
        setErro("");
      } else {
        setErro("Produto não encontrado");
      }
    };

    buscarProduto();
  }, []);

  const adicionarAoCarrinho = () => {
    if (!produto) return;
    
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho")) || [];
    const indexExistente = carrinhoAtual.findIndex(
      (item) => item._id === produto._id
    );
    if (indexExistente >= 0) {
      carrinhoAtual[indexExistente].quantidade += 1;
    } else {
      carrinhoAtual.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    alert("Produto adicionado ao carrinho!");
  };

  if (erro) return <p className="error-message">{erro}</p>;
  if (!produto) return <p className="loading">Carregando detalhes do produto...</p>;

  return (
    <div className="detalhes-produto">
      <div className="detalhes-imagem">
        {produto.imagem && <img src={produto.imagem} alt={produto.nome} />}
      </div>
      <div className="detalhes-info">
        <h1>{produto.nome}</h1>
        <p>{produto.descricao}</p>
        <p>Categoria: {produto.categoria}</p>
        <div className="detalhes-preco">
          {formatarPreco(produto.preco)}
        </div>
        <button className="btn-primary" onClick={adicionarAoCarrinho}>
          Adicionar ao Carrinho
        </button>
        <button className="btn-primary btn-secondary" onClick={() => navigate('/produtos')}>
          Voltar aos Produtos
        </button>
      </div>
    </div>
  );
};

export default DetalhesProduto;
