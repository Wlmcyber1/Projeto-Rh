import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import "./Pdf.css";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Pdf() {
  const [relatorioFolha, setRelatorioFolha] = useState([]);
  const [visitasDetalhadas, setVisitasDetalhadas] = useState([]);

  const buscarHorasTrabalhadas = async () => {
    try {
      const { data: funcionarios, error: erroUsers } = await supabase
        .from("users")
        .select("user_id, nome");

      if (erroUsers) {
        console.error("Erro ao buscar funcionários:", erroUsers.message);
        return;
      }

      // busca as visitas trazendo automaticamente o NOME da empresa via Foreign Key
      const { data: visitas, error } = await supabase
        .from("ataVisitas")
        .select(`*, empresas ( nome )`);

      if (error) {
        console.error("Erro do Supabase:", error.message);
        return;
      }

      if (!visitas || !funcionarios) return;

      // função auxiliar para converter "HH:MM:SS" em número decimal
      const converterHoraPraDecimal = (tempoTexto) => {
        if (!tempoTexto) return 0;
        const [horas, minutos] = tempoTexto.split(":");
        return (parseInt(horas, 10) || 0) + (parseInt(minutos, 10) || 0) / 60;
      };

      // função auxiliar para calcular salário
      const salarioTotal = (horasDecimal, valorPorHora = 60) =>
        horasDecimal * valorPorHora + 200;

      // mapeia cada visita associando o nome do funcionário e convertendo as horas
      const visitasComNome = visitas.map((visita) => {
        const funcionario = funcionarios.find(
          (u) => String(u.user_id) === String(visita.usuario_id)
        );

        return {
          ...visita,
          nome_funcionario: funcionario ? funcionario.nome : "Não encontrado",
          horas_decimal: converterHoraPraDecimal(visita.totalHoras),
        };
      });

      // agrupa e calcula as horas/salário por funcionário
      
      const folhaRH = funcionarios.map((func) => {
        const visitasDoFunc = visitasComNome.filter(
          (v) => String(v.usuario_id) === String(func.user_id)
        );

        const totalHorasMes = visitasDoFunc.reduce(
          (acc, item) => acc + item.horas_decimal,
          0
        );

        const valorHoraPadrao = 60;
        const salarioFinal = salarioTotal(totalHorasMes, valorHoraPadrao);

        return {
          id: func.user_id,
          nome: func.nome,
          totalHorasMes: totalHorasMes.toFixed(1),
          valorHora: valorHoraPadrao,
          salarioFinal,
        };
      });

      // estado é atualizado uma única vez, já com o array completo
      setRelatorioFolha(folhaRH);
      setVisitasDetalhadas(visitasComNome);
    } catch (error) {
      console.log("Erro inesperado:", error);
    }
  };

  const gerarDocumento = () => {
    if (relatorioFolha.length === 0) {
      alert("Ainda não há dados carregados para gerar o PDF.");
      return;
    }

    const doc = new jsPDF();

    // fonte/tamanho precisam ser definidos ANTES do texto que os usa
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("Folha de Pagamento", 14, 15);

    //quando estava chamando relatoriofolha, nao retornava nada, pq? 
    //pq relatorio folha so está alterado quando recebe a resposta da requisão (lembre-se: uma função assicrona demora um pouco para responder o que queremos)
    const linhas = relatorioFolha.map((func) => [
      func.nome,
      `${func.totalHorasMes}`,
      `R$ ${func.valorHora.toFixed(2)}`,
      `R$ ${func.salarioFinal.toFixed(2)}`,
    ]);

    autoTable(doc,{
      startY: 22,
      head: [["Funcionário", "Horas no mês", "Valor/hora", "Salário final"]],
      body: linhas,
    });

    doc.save("folha-de-pagamento.pdf");
  };

  useEffect(() => {
    buscarHorasTrabalhadas();
  }, []);

  return (
    <div className="botao-baixar">
      <button onClick={gerarDocumento}>Baixar Folha de Pagamento</button>
    </div>
  );
}

export default Pdf;