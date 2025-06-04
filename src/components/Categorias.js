import React, { useState, useEffect } from "react";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ nome: "" });
  const [categoriaEditando, setCategoriaEditando] = useState(null);

  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");
  const urlBase = "https://backend-completo.vercel.app/app/categorias";

  const buscarCategorias = async () => {
    setErro("");
    try {
      const res = await fetch(urlBase, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        setErro("Formato inesperado da resposta da API");
        return;
      }

      setCategorias(data);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!token) {
      setErro("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      if (categoriaEditando) {
        // Atualizar categoria
        const categoriaParaEnviar = {
          id: categoriaEditando._id, // Aqui usamos "id" como a API espera
          nome_categoria: form.nome.trim()
        };

        const res = await fetch(urlBase, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(categoriaParaEnviar)
        });

        const textoResposta = await res.text();

        if (!res.ok) throw new Error("Erro ao atualizar categoria: " + textoResposta);

        alert("Categoria atualizada!");
        setCategoriaEditando(null);
      } else {
        // Criar nova categoria
        const categoriaParaEnviar = {
          nome_categoria: form.nome.trim()
        };

        if (!categoriaParaEnviar.nome_categoria) {
          setErro("O nome da categoria não pode estar vazio.");
          return;
        }

        const res = await fetch(urlBase, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(categoriaParaEnviar)
        });

        const textoResposta = await res.text();

        if (!res.ok) throw new Error("Erro ao criar categoria: " + textoResposta);

        alert("Categoria criada com sucesso!");
      }

      setForm({ nome: "" });
      await buscarCategorias();
    } catch (err) {
      setErro(err.message);
    }
  };

  const iniciarEdicao = (categoria) => {
    setCategoriaEditando(categoria);
    setForm({ nome: categoria.nome || "" });
  };

  const excluirCategoria = async (_id) => {
    setErro("");
    if (!token) {
      setErro("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      const res = await fetch(urlBase, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: _id })
      });

      const textoResposta = await res.text();

      if (!res.ok) throw new Error("Erro ao excluir categoria: " + textoResposta);

      alert("Categoria excluída!");
      await buscarCategorias();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="categorias-container">
      <h1>Categorias</h1>
      <button onClick={buscarCategorias} className="btn-admin btn-primary-admin">
        Buscar Categorias
      </button>
      {erro && <p className="error-message">{erro}</p>}

      <ul className="categoria-lista">
        {categorias.map((c) => (
          <li key={c._id} className="categoria-item">
            <span className="categoria-nome">{c.nome}</span>
            <div className="categoria-acoes">
              <button className="btn-admin btn-secondary-admin" onClick={() => iniciarEdicao(c)}>
                Editar
              </button>
              <button className="btn-admin btn-danger-admin" onClick={() => excluirCategoria(c._id)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2>{categoriaEditando ? "Editar Categoria" : "Criar Nova Categoria"}</h2>
      <form className="produto-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome da Categoria"
          value={form.nome}
          onChange={handleChange}
          required
        />
        <div className="button-group">
          <button type="submit" className="btn-admin btn-primary-admin">
            {categoriaEditando ? "Salvar Alterações" : "Criar Categoria"}
          </button>
          {categoriaEditando && (
            <button
              type="button"
              className="btn-admin btn-secondary-admin"
              onClick={() => {
                setCategoriaEditando(null);
                setForm({ nome: "" });
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

export default Categorias;