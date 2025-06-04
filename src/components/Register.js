
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Register() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const navigate = useNavigate();

  const ValidaCadastro = async () => {
    if (senha !== confirma) {
      alert('As senhas não coincidem.');
      return;
    }

    const url = 'https://backend-completo.vercel.app/app/registrar';
    const dados = {
      usuario,
      senha,
      confirma
    };

    try {
      const retorno = await axios.post(url, dados);
      console.log(retorno);

      if (retorno.data.erro) {
        alert(retorno.data.erro);
        return;
      }

      alert('Usuário cadastrado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro ao registrar:', err);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Criar Conta</h1>

      <input
        type="text"
        placeholder="usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <input
        type="password"
        placeholder="confirmar senha"
        value={confirma}
        onChange={(e) => setConfirma(e.target.value)}
      />
      <input
        type="button"
        value="Cadastrar"
        onClick={() => ValidaCadastro()}
      />

      <p>
        Já tem uma conta? <a href="/">Fazer Login</a>
      </p>
    </div>
  );
}

export default Register;
