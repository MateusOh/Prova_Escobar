import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const ValidaUsuario = async () => {
    const url = 'https://backend-completo.vercel.app/app/login';
    const dados = { usuario, senha };

    try {
      const retorno = await axios.post(url, dados);
      console.log(retorno.data);

      // Verifica se há erro
      if (retorno.data.erro) {
        alert(retorno.data.erro);
        return; // impede o login
      }

      // Verifica se recebeu um token válido
      if (retorno.data.token) {
        localStorage.setItem('token', retorno.data.token);
        localStorage.setItem('usuario', usuario);
        alert('Login realizado com sucesso!');
        navigate('/admin');
      } else {
        alert('Usuário ou senha inválidos.');
      }

    } catch (err) {
      console.error('Erro ao fazer login:', err);
      alert('Erro ao conectar com o servidor. Tente novamente.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Faça seu login</h1>

      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Sua senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <input
        type="button"
        value="Login"
        onClick={ValidaUsuario}
      />

      <p>
        Não tem uma conta? <Link to="/register">Criar conta</Link>
      </p>
      <p>
        Seu acesso é de cliente? <Link to="/produtos">Área de Cliente</Link>
      </p>
    </div>
  );
}

export default Login;
