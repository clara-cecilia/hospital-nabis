import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [fila, setFila] = useState({
    emergencia: [],
    preferencial: [],
    normal: [],
  });

  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  const [nomePaciente, setNomePaciente] = useState("");

  useEffect(() => {
    const filaSalva = JSON.parse(localStorage.getItem("fila")) || {
      emergencia: [],
      preferencial: [],
      normal: [],
    };
    const ultimasSenhasSalvas = JSON.parse(localStorage.getItem("ultimasSenhas")) || [];
    setFila(filaSalva);
    setUltimasSenhas(ultimasSenhasSalvas);
  }, []);

  const gerarSenha = (tipo) => {
    if (!nomePaciente.trim()) {
      alert("O nome do paciente é obrigatório!");
      return;
    }

    const novaSenha = {
      senha: `${tipo[0].toUpperCase()}${fila[tipo].length + 1}`,
      nome: nomePaciente,
    };

    const novaFila = {
      ...fila,
      [tipo]: [...fila[tipo], novaSenha],
    };

    setFila(novaFila);
    localStorage.setItem("fila", JSON.stringify(novaFila));
    setNomePaciente("");
  };

  const chamarSenha = () => {
    let proximaSenha = null;
    let novaFila = { ...fila };

    if (fila.emergencia.length > 0) {
      proximaSenha = fila.emergencia[0];
      novaFila.emergencia = fila.emergencia.slice(1);
    } else if (fila.preferencial.length > 0) {
      proximaSenha = fila.preferencial[0];
      novaFila.preferencial = fila.preferencial.slice(1);
    } else if (fila.normal.length > 0) {
      proximaSenha = fila.normal[0];
      novaFila.normal = fila.normal.slice(1);
    }

    if (proximaSenha) {
      const horaChamada = new Date().toLocaleTimeString();
      const senhaComHorario = { ...proximaSenha, horaChamado: horaChamada };

      setSenhaAtual(senhaComHorario);
      const novasUltimasSenhas = [senhaComHorario, ...ultimasSenhas].slice(0, 3);
      setUltimasSenhas(novasUltimasSenhas);

      setFila(novaFila);
      localStorage.setItem("fila", JSON.stringify(novaFila));
      localStorage.setItem("ultimasSenhas", JSON.stringify(novasUltimasSenhas));
    } else {
      alert("Nenhuma senha na fila.");
    }
  };

  return (
    <div className="App">
      <h1>Sistema de Senhas</h1>

      {/* Entrada para o nome do paciente */}
      <div className="entrada-nome">
        <label htmlFor="nomePaciente">Digite o nome do paciente:</label>
        <input
          type="text"
          id="nomePaciente"
          value={nomePaciente}
          onChange={(e) => setNomePaciente(e.target.value)}
          placeholder="Nome do paciente"
        />
      </div>

      {/* Botões para gerar senhas */}
      <div className="botoes">
        <button onClick={() => gerarSenha("emergencia")}>Emergência</button>
        <button onClick={() => gerarSenha("preferencial")}>Preferencial</button>
        <button onClick={() => gerarSenha("normal")}>Normal</button>
      </div>

      {/* Painel de senha atual */}
      <div className="painel-atual">
        <h2>Senha Atual</h2>
        {senhaAtual ? (
          <p>
            <strong>Senha:</strong> {senhaAtual.senha} |{" "}
            <strong>Nome:</strong> {senhaAtual.nome} |{" "}
            <strong>Hora:</strong> {senhaAtual.horaChamado}
          </p>
        ) : (
          <p>Nenhuma senha chamada.</p>
        )}
      </div>

      {/* Painel de últimas senhas chamadas */}
      <div className="ultimas-senhas">
        <h2>Últimas Senhas Chamadas</h2>
        <ul>
          {ultimasSenhas.map((senha, index) => (
            <li key={index}>
              <strong>Senha:</strong> {senha.senha} |{" "}
              <strong>Nome:</strong> {senha.nome} |{" "}
              <strong>Hora:</strong> {senha.horaChamado}
            </li>
          ))}
        </ul>
      </div>

      {/* Exibição das filas de senhas */}
      <div className="filas">
        <h2>Senhas na Fila</h2>
        <div className="fila">
          <h3>Emergência</h3>
          <ul>
            {fila.emergencia.map((senha, index) => (
              <li key={index}>
                <strong>Senha:</strong> {senha.senha} | <strong>Nome:</strong> {senha.nome}
              </li>
            ))}
          </ul>
        </div>
        <div className="fila">
          <h3>Preferencial</h3>
          <ul>
            {fila.preferencial.map((senha, index) => (
              <li key={index}>
                <strong>Senha:</strong> {senha.senha} | <strong>Nome:</strong> {senha.nome}
              </li>
            ))}
          </ul>
        </div>
        <div className="fila">
          <h3>Normal</h3>
          <ul>
            {fila.normal.map((senha, index) => (
              <li key={index}>
                <strong>Senha:</strong> {senha.senha} | <strong>Nome:</strong> {senha.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Botão para chamar a próxima senha */}
      <div className="chamar-senha">
        <button onClick={chamarSenha}>Chamar Próxima Senha</button>
      </div>
    </div>
  );
}

export default App;