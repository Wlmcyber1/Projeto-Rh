import React, { useEffect, useState } from "react";
import "./AtasDashboard.css"; // Mantém o mesmo arquivo de estilos CSS
import { supabase } from "../supabaseClient";
import Pdf from "../Pdf";

function FechamentoFolha() {
  // Estados para armazenar os dados calculados e o histórico de visitas
  const [relatorioFolha, setRelatorioFolha] = useState([]);
  const [visitasDetalhadas, setVisitasDetalhadas] = useState([]);
 
  const buscarHorasTrabalhadas = async () => {
    try {
      // busca os funcionários
      const { data: funcionarios, error: erroUsers } = await supabase
        .from("users")
        .select("user_id, nome");

      // busca as visitas trazendo automaticamente o NOME da empresa via Foreign Key
      const { data: visitas, error } = await supabase.from("ataVisitas")
        .select(`
          *,
          empresas (
            nome
          )
        `);

      if (error) {
        console.error("Erro do Supabase:", error.message);
        return;
      }

      if (!visitas || !funcionarios) return;

      //  função auxiliar para converter "HH:MM:SS" em número decimal
      const converterHoraPraDecimal = (tempoTexto) => {
        if (!tempoTexto) return 0;
        const partes = tempoTexto.split(":");
        const horas = parseInt(partes[0], 10) || 0;
        const minutos = parseInt(partes[1], 10) || 0;

        return horas + minutos / 60;
      };

      // função auxiliar para calcular salário
      const salarioTotal = (horasDecimal, valorPorHora = 60) => {
        return horasDecimal * valorPorHora + 200;
      };

      // mapeia cada visita associando o nome do funcionário e convertendo as horas
      const visitasComNome = visitas.map((visita) => {
        const funcionario = funcionarios.find(
          (u) => String(u.user_id) === String(visita.usuario_id),
        );

        const horasDecimal = converterHoraPraDecimal(visita.totalHoras);

        return {
          ...visita,
          nome_funcionario: funcionario ? funcionario.nome : "Não encontrado",
          horas_decimal: horasDecimal,
        };
      });

      // agrupa e calcula as horas/salário por funcionário para a Folha do RH
      //muda o estado de relatorio folha. (aqui ele está fazendo o calculo de salario e horas, com base na busca (se o id for igual na tabela users e atasVisitas, ele guarda))
      const folhaRH = funcionarios.map((func) => {
        const visitasDoFunc = visitasComNome.filter(
          (v) => String(v.usuario_id) === String(func.user_id),
        );

        const totalHorasMes = visitasDoFunc.reduce(
          (acc, item) => acc + item.horas_decimal,
          0,
        );

        const valorHoraPadrao = 60;
        const salarioFinal = salarioTotal(totalHorasMes, valorHoraPadrao);
       
        return {
          id: func.user_id,
          nome: func.nome,
          totalHorasMes: totalHorasMes.toFixed(1),
          valorHora: valorHoraPadrao,
          salarioFinal: salarioFinal,
        };
      });

      // atualiza os estados para a interface React
      setRelatorioFolha(folhaRH);
      setVisitasDetalhadas(visitasComNome);
    } catch (error) {
      console.log("Erro inesperado:", error);
    }
  };

  useEffect(() => {
    buscarHorasTrabalhadas();
  }, []);

  return (
    <div className="dashboard-container">
      {/* CABEÇALHO */}
      
      <header className="dashboard-header">
        <h1>Painel de Fechamento de Folha</h1>
        <p>Visão consolidada de horas trabalhadas e auditoria por empresa</p>
      </header>

      {/* SELETOR DE MÊS */}
      <section className="filter-section">
        <label htmlFor="mes">Mês de Competência:</label>
        <select id="mes" defaultValue="2026-06">
          <option value="2026-05">Maio / 2026</option>
          <option value="2026-06">Junho / 2026</option>
          <option value="2026-07">Julho / 2026</option>
        </select>
        

        <label htmlFor="mes">Nome funcionario:</label>
        <select id="mes" defaultValue="">
          <option value="2026-05">fran</option>
          <option value="2026-06">irisney</option>
          
        </select>
        <Pdf></Pdf>
      </section>

      {/* TABELA 1: RESUMO MENSAL DA FOLHA DO RH */}
      <div className="table-container">
        
          <h2 className="section-title">Visualização Geral do RH</h2>
         

        <table className="custom-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Total de Horas no Mês</th>
              <th>Valor por Hora (Base)</th>
              <th>Salário Final Estimado</th>
            </tr>
          </thead>
          <tbody>
            {relatorioFolha.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Carregando dados da folha...
                </td>
              </tr>
            ) : (
              relatorioFolha.map((item) => (
                <tr key={item.id}>
                  <td className="employee-name">{item.nome}</td>
                  <td>
                    <span className="badge-hours">
                      {item.totalHorasMes} horas
                    </span>
                  </td>
                  <td>R$ {item.valorHora},00</td>
                  <td className="salary-text">
                    {item.salarioFinal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TABELA 2: HISTÓRICO DETALHADO DAS VISITAS */}
      <div className="table-container">
        <h2 className="section-title">Histórico Detalhado (Aba de Apoio)</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Dia da Visita</th>
              <th>Empresa Atendida</th>
              <th>Tempo Alocado</th>
            </tr>
          </thead>
          <tbody>
            {visitasDetalhadas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Nenhum registro de visita encontrado.
                </td>
              </tr>
            ) : (
              visitasDetalhadas.map((visita) => (
                <tr key={visita.id}>
                  <td className="employee-name">{visita.nome_funcionario}</td>
                  <td>{visita.data_visita || "N/A"}</td>
                  <td>{visita.empresas?.nome || "Empresa não vinculada"}</td>
                  <td>{visita.totalHoras || "00:00"} hrs</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FechamentoFolha;
