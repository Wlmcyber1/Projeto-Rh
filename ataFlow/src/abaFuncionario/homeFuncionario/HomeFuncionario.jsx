import React, { useEffect, useState } from "react";
import "./HomeFuncionario.css";
import RegistrarVisita from "../RegistrarVisita";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Pdf from "../../Pdf";
import Swal from "sweetalert2";
export default function HomeFuncionario() {
  const [registrarVisita, setRegistrarVisita] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);
  const [nomeEmpresa, setNomeEmpresa] = useState([]);
  //AJUSTAR BOTÃO DE PAGAMENTO (ESTÁ MOSTRANDO TODOS OS FUNCIONARIOS E NÃO É ISSO QUE QUEREMOS)

  //  Criamos a função para buscar o nome
  const mostrarNome = async () => {
    try {
      // Pega o ID do usuário autenticado na sessão ativa do Supabase

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        //busca o nome do usuário correspondente na tabela "users"
        const { data: perfil, error } = await supabase
          //pegue o que veio em data e salve com o apelido de perfil

          .from("users")
          //vá para tabela users
          .select("nome")
          //selecione a coluna nome
          .eq("user_id", user.id)
          //que seja igual a user_id (é o where)
          .maybeSingle();
        //Eu sei que essa busca só vai trazer 1 ou nenhum resultado. Então, me devolva direto o objeto {} em vez de uma lista.

        if (perfil && !error) {
          setNomeUsuario(perfil.nome);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar nome:", error);
    }
  };

  const mostrarEmpresas = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: perfil, error } = await supabase
          .from("ataVisitas")
          .select("totalHoras, data_visita,empresa_id, empresas(nome) ")
          .eq("usuario_id", user.id);

        setNomeEmpresa(perfil);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //  useEffect executa a função mostrarNome assim que a tela abre
  useEffect(() => {
    (mostrarNome(), mostrarEmpresas());
  }, []);

  
  const handleTelaVisita = () => {
    navigate("/funcionario/registrar-visita");
  };

  const handleTelaLegislacao = () => {
    navigate("/funcionario/legislacao");
  };

  const handleSairDeHome = async () => {
    const resultado = await Swal.fire({
      icon: 'question',
      iconColor: '#14141a',
      title: 'Sair do sistema?',
      text: 'Você realmente deseja encerrar sua sessão como Funcionário(a)?',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      color: '#17181c',
      confirmButtonColor: '#14141a',
      customClass: {
        popup: 'ataflow-swal-popup',
        confirmButton: 'ataflow-swal-confirm',
        cancelButton: 'ataflow-swal-cancel',
      },
    });

    if (resultado.isConfirmed) {
      navigate("/login");
    }
  };

  return (
    <div className="home-func-container">
      <button className="btn-voltar" type="button" onClick={handleSairDeHome}>
        ← Voltar para o Início
      </button>

      {/* SEÇÃO DE BOAS-VINDAS */}
      <section className="welcome-section">
        <div className="welcome-text">
          <h1>Olá, {nomeUsuario}</h1>
          <p>
            Bem-vinda de volta. Registre suas visitas técnico-operacionais com
            facilidade.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn-secundario" onClick={handleTelaLegislacao}>
            Legislação
          </button>
          <button className="btn-nova-ata" onClick={handleTelaVisita}>
            + Registrar Nova Visita
          </button>
        </div>
      </section>

      {/* SEU HISTÓRICO RECENTE */}
      <div className="history-card">
        <div className="titlo-fechamento">
          <h2>Meus Registros Recentes (Mês Atual)</h2>

          
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Empresa Atendida</th>
              
              <th>Total de Horas</th>
            </tr>
          </thead>
          <tbody>
            {/*ao inves de usarmos o return usamos o paranteses*/}
            {nomeEmpresa.map((e) => (
              <tr key={e.id}>
                <td>{e.data_visita}</td>
                <td>{e.empresas.nome}</td>
                <td>{e.totalHoras}</td>
                
              </tr>
            ))}

            
          </tbody>
        </table>
      </div>
    </div>
  );
}
