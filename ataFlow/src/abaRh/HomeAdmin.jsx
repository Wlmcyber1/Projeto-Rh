import React, { useState } from "react";
import "./HomeAdmin.css";
import VisualizacaoAtas from "./VisualizacaoAtas";
import VisualizacaoFuncionarias from "./abasFuncoesHome/VisualizacaoFuncionarias";
import FechamentoFolha from "./FechamentoFolha";
import VisualizacaoEmpresas from "./VisualizaçãoEmpresa";
import Legislacao from "../Legislacao";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

const IconGrid = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
  </svg>
);

const IconUsers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" />
    <path d="M16 4.3c1.6.4 2.7 1.9 2.7 3.5 0 1.6-1.1 3.1-2.7 3.5" />
    <path d="M19 20c0-2.5-1.6-4.4-3.8-5" />
  </svg>
);

const IconBuilding = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="3" width="10" height="18" rx="1.2" />
    <rect x="14" y="9" width="6" height="12" rx="1.2" />
    <path d="M7.3 7h3M7.3 10.6h3M7.3 14.2h3" />
  </svg>
);

const IconCheckCircle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8.3 12.4l2.4 2.3 4.8-5.1" />
  </svg>
);

const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </svg>
);

const IconBook = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 5.5C4 4.1 5.1 3 6.5 3H12v18H6.5C5.1 21 4 19.9 4 18.5v-13Z" />
    <path d="M20 5.5C20 4.1 18.9 3 17.5 3H12v18h5.5c1.4 0 2.5-1.1 2.5-2.5v-13Z" />
  </svg>
);

const IconBell = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 10.5a6 6 0 1 1 12 0c0 3.2 1 4.6 1.6 5.4.3.4 0 1-.5 1H4.9c-.5 0-.8-.6-.5-1 .6-.8 1.6-2.2 1.6-5.4Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export default function HomeAdmin() {
  const [telaAtiva, setTelaAtiva] = useState(null);

  const [menuFechado, setMenuFechado] = useState(false);

  const handleIrParaInicio = () => setTelaAtiva(null);

  const handleMudarTelaFuncionario = () => setTelaAtiva("funcionarias");
  const handleMudarTelaFolha = () => setTelaAtiva("folha");
  const handleMudarTelaEmpres = () => setTelaAtiva("empresa");
  const handleMudarTelaLegislacao = () => setTelaAtiva("legislacao");

  const navigate = useNavigate();

  const handleToggleSidebar = () => setMenuFechado(!menuFechado);

  const handleVoltarTelaInicio = async () => {
    const resultado = await Swal.fire({
      icon: "question",
      iconColor: "#14141a",
      title: "Sair do sistema?",
      text: "Você realmente deseja encerrar sua sessão como RH/Administrador?",
      showCancelButton: true,
      confirmButtonText: "Sim, sair",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      color: "#17181c",
      confirmButtonColor: "#14141a",
      customClass: {
        popup: "ataflow-swal-popup",
        confirmButton: "ataflow-swal-confirm",
        cancelButton: "ataflow-swal-cancel",
      },
    });

    if (resultado.isConfirmed) {
      navigate("*");
    }
  };

  const dataDeHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const infoFuncionario = async () => {
    try {
      const { data, error } = await supabase
        .from("ataVisitas")
        .select("hora_entrada, hora_saida");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${menuFechado ? "fechada" : ""}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div>
              <h1>AtaFlow</h1>
              <p>Painel RH</p>
            </div>
          </div>

          <ul className="sidebar-menu">
            <li
              className={`menu-item ${telaAtiva === null ? "active" : ""}`}
              onClick={handleIrParaInicio}
            >
              <IconGrid />
              Visão Geral
            </li>

            <li
              className={`menu-item ${telaAtiva === "funcionarias" ? "active" : ""}`}
              onClick={handleMudarTelaFuncionario}
            >
              <IconUsers />
              Funcionárias
            </li>

            <li
              className={`menu-item ${telaAtiva === "empresa" ? "active" : ""}`}
              onClick={handleMudarTelaEmpres}
            >
              <IconBuilding />
              Empresas Parceiras
            </li>

            <li
              className={`menu-item ${telaAtiva === "folha" ? "active" : ""}`}
              onClick={handleMudarTelaFolha}
            >
              <IconCheckCircle />
              Fechamento de Folha
            </li>

            <li
              className={`menu-item ${telaAtiva === "legislacao" ? "active" : ""}`}
              onClick={handleMudarTelaLegislacao}
            >
              <IconBook />
              Legislação
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-nome">Administrador</p>
              <p className="sidebar-profile-cargo">RH · AtaFlow</p>
            </div>
          </div>
          <button
            className="btn-logout"
            type="button"
            onClick={handleVoltarTelaInicio}
          >
            Sair do sistema
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top-bar">
          <div className="top-bar-left">
            <button
              className="btn-toggle-sidebar"
              type="button"
              onClick={handleToggleSidebar}
              title="Recolher/Expandir Menu"
            >
              ☰
            </button>

            <div className="top-bar-search">
              <IconSearch />
              <input type="text" placeholder="Buscar funcionária, empresa..." />
            </div>
          </div>
        </div>

        {telaAtiva === "atas" && (
          <div className="animacao-fade">
            <button
              className="btn-voltar"
              type="button"
              onClick={handleIrParaInicio}
            >
              ← Voltar para o Início
            </button>
            <VisualizacaoAtas />
          </div>
        )}

        {telaAtiva === "funcionarias" && (
          <div className="animacao-fade">
            <button
              className="btn-voltar"
              type="button"
              onClick={handleIrParaInicio}
            >
              ← Voltar para o Início
            </button>
            <VisualizacaoFuncionarias />
          </div>
        )}

        {telaAtiva === "folha" && (
          <div className="animacao-fade">
            <button
              className="btn-voltar"
              type="button"
              onClick={handleIrParaInicio}
            >
              ← Voltar para o Início
            </button>
            <FechamentoFolha />
          </div>
        )}

        {telaAtiva === "empresa" && (
          <div className="animacao-fade">
            <button
              className="btn-voltar"
              type="button"
              onClick={handleIrParaInicio}
            >
              ← Voltar para o Início
            </button>
            <VisualizacaoEmpresas />
          </div>
        )}

        {telaAtiva === "legislacao" && (
          <div className="animacao-fade">
            <button
              className="btn-voltar"
              type="button"
              onClick={handleIrParaInicio}
            >
              ← Voltar para o Início
            </button>
            <Legislacao embedded />
          </div>
        )}

        {telaAtiva === null && (
          <>
            <header className="admin-header">
              <h2>Olá, Administrador</h2>
              <span className="tag-data">{dataDeHoje}</span>
            </header>
            <p className="admin-subtitulo">
              Selecione uma área abaixo para começar.
            </p>

            <section className="acesso-rapido-grid">
              <div className="card-acesso" onClick={handleMudarTelaFuncionario}>
                <div className="card-acesso-topo">
                  <div className="card-acesso-icone">
                    <IconUsers />
                  </div>
                  <span className="card-acesso-indice">01</span>
                </div>
                <h4>Funcionárias</h4>
                <p>Gerenciar cadastro e dados das funcionárias.</p>
                <div className="card-acesso-barra">
                  <span />
                </div>
              </div>

              <div className="card-acesso" onClick={handleMudarTelaEmpres}>
                <div className="card-acesso-topo">
                  <div className="card-acesso-icone">
                    <IconBuilding />
                  </div>
                  <span className="card-acesso-indice">02</span>
                </div>
                <h4>Empresas Parceiras</h4>
                <p>Visualizar e gerenciar empresas atendidas.</p>
                <div className="card-acesso-barra">
                  <span />
                </div>
              </div>

              <div className="card-acesso" onClick={handleMudarTelaFolha}>
                <div className="card-acesso-topo">
                  <div className="card-acesso-icone">
                    <IconCheckCircle />
                  </div>
                  <span className="card-acesso-indice">03</span>
                </div>
                <h4>Fechamento de Folha</h4>
                <p>Conferir e fechar a folha do período.</p>
                <div className="card-acesso-barra">
                  <span />
                </div>
              </div>

              <div className="card-acesso" onClick={handleMudarTelaLegislacao}>
                <div className="card-acesso-topo">
                  <div className="card-acesso-icone">
                    <IconBook />
                  </div>
                  <span className="card-acesso-indice">04</span>
                </div>
                <h4>Legislação</h4>
                <p>
                  Consultar legislação federal, estadual, de alimentos e
                  rotulagem.
                </p>
                <div className="card-acesso-barra">
                  <span />
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
