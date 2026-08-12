import React, { useEffect, useState } from "react";
import "./RegistrarVisita.css";
import { supabase } from "../supabaseClient";
import HomeFuncionario from "./homeFuncionario/HomeFuncionario";
import { useNavigate } from 'react-router-dom';
export default function RegistrarVisita() {
  
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState("");
  const [dataVisita, setDataVisita] = useState("");
  const [horaEntrada, setHoraentrada] = useState("");
  const [horaSaida, setHoraSaida] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  const handleVoltarTela=()=>{
    navigate('/funcionario/home')
  }

  const carregarEmpresas = async () => {
    try {
      const { data, error } = await supabase
        .from("empresas") // Vá na tabela empresas
        .select("id, nome"); // Pegue apenas o id e o nome delas 

      if (error) throw error; // Se der erro, joga pro "catch"

      if (data) {
        setEmpresas(data); // Guarda a lista de empresas no estado do React
      }
    } catch (error) {
      console.error("Erro ao carregar empresas:", error.message);
    }
  };

  // Executa assim que a tela abre
  useEffect(() => {
    carregarEmpresas();
  }, []);


  const gravarVisita = async (e) => {
    e.preventDefault(); // impede a página de recarregar ao enviar o formulário

    try {
      // descobre o ID do usuário que está logado
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Usuário não autenticado!");
        return;
      }

      // envia os dados para a tabela 'ataVisitas'
      const { data, error } = await supabase
        .from("ataVisitas") // Sua tabela de visitas
        .insert([
          {
            usuario_id: user.id,
            empresa_id: empresaSelecionada,
            data_visita: dataVisita,
            hora_entrada: horaEntrada,
            hora_saida: horaSaida,
            descricao_atividades: descricao,
            totalHoras: calcularTempoTotal(),
          },
        ]);

      if (error) throw error;

      alert("Visita registrada com sucesso!");
       
      
    } catch (error) {
      console.error("Erro ao gravar visita:", error.message);
      alert(
        "Erro ao salvar os dados. Verifique os campos ou as permissões do RLS.",
      );
    }
  };
  const calcularTempoTotal = () => {
    if (!horaEntrada || !horaSaida) return "00:00";
    // transforma as horas (ex: "08:30") em minutos totais desde o início do dia
    const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
    const [hSaida, mSaida] = horaSaida.split(":").map(Number);

    const totalMinutosEntrada = hEntrada * 60 + mEntrada;
    const totalMinutosSaida = hSaida * 60 + mSaida;

    // calcula a diferença em minutos
    let diferencaMinutos = totalMinutosSaida - totalMinutosEntrada;

    // se a saída for menor que a entrada
    if (diferencaMinutos < 0) {
      diferencaMinutos += 24 * 60;
    }

    // Transforma de volta para o formato HH:MM
    const horasResultantes = Math.floor(diferencaMinutos / 60);
    const minutosResultantes = diferencaMinutos % 60;

    // Formata para ter sempre 2 dígitos (ex: "02:05")
    const horasFormatadas = String(horasResultantes).padStart(2, "0");
    const minutosFormatados = String(minutosResultantes).padStart(2, "0");

    return `${horasFormatadas}:${minutosFormatados}`;
  };
  return (
    <div className="registrar-visita-container">
      {/* CABEÇALHO */}
      <header className="form-header">
        <h1>Lançar Nova Visita Técnica</h1>
        <p>
          Preencha os dados abaixo. Suas horas serão calculadas automaticamente
          para o painel do RH.
        </p>
      </header>

      {/* CARD DO FORMULÁRIO */}
      <div className="form-card">
        <form className="visita-form">
          {/* SELEÇÃO DA EMPRESA ATUALIZADA COM A LISTA COMPLETA DA PLANILHA */}
          <div className="form-group">
            <label htmlFor="empresa-visitada">
              Selecione a Empresa / Operação
            </label>
            <select
              className="empresa-visitada"
              value={empresaSelecionada}
              onChange={(e) => setEmpresaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma empresa...</option>

              {/* O .map percorre o array de empresas e cria uma <option> para cada uma */}
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome}
                </option>
              ))}
            </select>
          </div>

          {/* DATA DA VISITA */}
          <div className="form-group">
            <label htmlFor="data-visita">Data da Visita</label>
            <input
              type="date"
              id="data-visita"
              onChange={(e) => setDataVisita(e.target.value)}
            />
          </div>

          {/* REGISTRO DE HORÁRIO DE TRABALHO */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hora-entrada">Horário de Entrada</label>
              <input
                type="time"
                id="hora-entrada"
                onChange={(e) => setHoraentrada(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora-saida">Horário de Saída</label>
              <input
                type="time"
                id="hora-saida"
                onChange={(e) => setHoraSaida(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="total-horas">Tempo Total</label>
              <input
                type="text"
                id="total-horas"
                value={calcularTempoTotal()}
                disabled
                style={{
                  backgroundColor: "#f4f5f7",
                  cursor: "not-allowed",
                  fontWeight: "bold",
                }}
              />
            </div>
          </div>

          {/* ATA DE ATIVIDADES */}
          <div className="form-group">
            <label htmlFor="detalhes-atividades">
              O que foi executado na visita? (Ata de Visita)
            </label>
            <textarea 
              id="detalhes-atividades"
              rows="5"
              placeholder="Descreva as tarefas executadas, pontos importantes ou próximas ações programadas..."
              onChange={(e)=>setDescricao(e.target.value)}
            ></textarea>
          </div>

          {/* AÇÕES */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={handleVoltarTela}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-salvar"
             onClick={gravarVisita}
            >
              {/*necessario adicionar isso dentro de um form e adicionar o onSubmit para adicionar a função voltar e gravar visita  */}
              Gravar Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
