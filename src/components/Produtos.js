import React, { useState, useEffect } from "react";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    quantidade: "",
    preco: "",
    categoria: "",
    descricao: "",
    imagem: ""
  });
  const [produtoEditando, setProdutoEditando] = useState(null);

  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");
  const urlBaseProdutos = "https://backend-completo.vercel.app/app/produtos";
  const urlBaseCategorias = "https://backend-completo.vercel.app/app/categorias";

  // Função para formatar preços grandes
  const formatarPreco = (preco) => {
    return preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para limpar formatação de número
  const limparFormatacaoNumero = (valor) => {
    if (typeof valor === 'string') {
      return valor.replace(/\D/g, '');
    }
    return valor;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'preco') {
      // Remove tudo que não é número
      const numeroLimpo = limparFormatacaoNumero(value);
      
      // Converte para número com 2 casas decimais
      const numero = (parseFloat(numeroLimpo) / 100).toFixed(2);
      
      setForm(prev => ({ ...prev, [name]: numero }));
    } else if (name === 'quantidade') {
      // Remove tudo que não é número
      const numeroLimpo = limparFormatacaoNumero(value);
      setForm(prev => ({ ...prev, [name]: numeroLimpo }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Buscar produtos
  const buscarProdutos = async () => {
    setErro("");
    try {
      const res = await fetch(`${urlBaseProdutos}/${usuario}`, {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        setErro("Formato inesperado da resposta da API");
        return;
      }
      setProdutos(data);
    } catch (err) {
      setErro(err.message);
    }
  };

  // Buscar categorias
  const buscarCategorias = async () => {
    try {
      const res = await fetch(urlBaseCategorias, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!Array.isArray(data)) {
        setErro("Erro ao carregar categorias");
        return;
      }
      setCategorias(data);
    } catch (err) {
      setErro("Erro ao buscar categorias: " + err.message);
    }
  };

  // Carrega categorias ao iniciar
  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    const produtoParaEnviar = {
      ...form,
      quantidade: parseInt(form.quantidade),
      preco: parseFloat(form.preco)
    };

    try {
      if (produtoEditando) {
        produtoParaEnviar.id = produtoEditando._id;

        const res = await fetch(urlBaseProdutos, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(produtoParaEnviar)
        });

        if (!res.ok) throw new Error("Erro ao atualizar produto");

        alert("Produto atualizado!");
        setProdutoEditando(null);
      } else {
        produtoParaEnviar.usuario = usuario;

        const res = await fetch(urlBaseProdutos, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(produtoParaEnviar)
        });

        if (!res.ok) throw new Error("Erro ao criar produto");

        alert("Produto criado com sucesso!");
      }

      setForm({
        nome: "",
        quantidade: "",
        preco: "",
        categoria: "",
        descricao: "",
        imagem: ""
      });
      buscarProdutos();
    } catch (err) {
      setErro(err.message);
    }
  };

  const iniciarEdicao = (produto) => {
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      quantidade: produto.quantidade.toString(),
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      descricao: produto.descricao,
      imagem: produto.imagem
    });
  };

  const excluirProduto = async (id) => {
    setErro("");
    try {
      const res = await fetch(urlBaseProdutos, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ id })
      });

      if (!res.ok) throw new Error("Erro ao excluir produto");

      alert("Produto excluído!");
      buscarProdutos();
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="produtos-container">
      <h1>Produtos</h1>
      <button onClick={buscarProdutos} className="btn-admin btn-primary-admin">
        Buscar Produtos
      </button>
      {erro && <p className="error-message">{erro}</p>}

      <table className="produtos-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Imagem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => (
            <tr key={p._id}>
              <td>{p.nome}</td>
              <td>{formatarPreco(p.preco)}</td>
              <td>{p.quantidade}</td>
              <td>{p.categoria}</td>
              <td>{p.descricao}</td>
              <td><img src={p.imagem} alt={p.nome} /></td>
              <td className="button-group">
                <button className="btn-admin btn-secondary-admin" onClick={() => iniciarEdicao(p)}>
                  Editar
                </button>
                <button className="btn-admin btn-danger-admin" onClick={() => excluirProduto(p._id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{produtoEditando ? "Editar produto" : "Criar novo produto"}</h2>
      <form className="produto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="quantidade"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
        />
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c._id} value={c.nome}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imagem"
          placeholder="URL da Imagem"
          value={form.imagem}
          onChange={handleChange}
          required
        />
        <div className="button-group">
          <button type="submit" className="btn-admin btn-primary-admin">
            {produtoEditando ? "Salvar Alterações" : "Criar Produto"}
          </button>
          {produtoEditando && (
            <button
              type="button"
              className="btn-admin btn-secondary-admin"
              onClick={() => {
                setProdutoEditando(null);
                setForm({
                  nome: "",
                  quantidade: "",
                  preco: "",
                  categoria: "",
                  descricao: "",
                  imagem: ""
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Produtos;