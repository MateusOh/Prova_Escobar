import React from 'react';
import { useNavigate } from 'react-router-dom';

const Agradecimento = () => {
  const navigate = useNavigate();

  return (
    <div className="agradecimento">
      <h1>Obrigado pela sua compra!</h1>
      <p>Em breve, você receberá um e-mail com os detalhes da sua compra.</p>
      <button className="btn-primary" onClick={() => navigate('/produtos')}>
        Continuar Comprando
      </button>
    </div>
  );
};

export default Agradecimento;