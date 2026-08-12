import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Legislacao.css";
import ESTADOS from "./data/estadosBrasil.json";
import RESOLUCOES_FEDERAL from "./data/legislacaoFederal.json";
import RESOLUCOES_ALIMENTOS from "./data/legislacaoAlimentos.json";
import RESOLUCOES_ROTULAGEM from "./data/legislacaoRotulagem.json";

const legislacaoPorCategoria = {
  federal: RESOLUCOES_FEDERAL,
  alimentos: RESOLUCOES_ALIMENTOS,
  rotulagem: RESOLUCOES_ROTULAGEM,
};

const gerarLegislacaoEstadual = (estado) => [
  {
    id: `${estado.sigla}-1`,
    numero: "Vigilância Sanitária Estadual",
    titulo: `Legislação sanitária de alimentos — ${estado.nome}`,
    descricao: `Consulte as normas e resoluções estaduais vigentes sobre alimentos e rotulagem aplicáveis a estabelecimentos em ${estado.nome}.`,
    link: null,
  },
];

const CATEGORIAS = [
  { key: "federal", label: "Legislação Federal", icone: "gavel" },
  { key: "estadual", label: "Legislação Estadual", icone: "mapa" },
  { key: "alimentos", label: "Alimentos", icone: "alimento" },
  { key: "rotulagem", label: "Rotulagem", icone: "etiqueta" },
];

const IconCategoria = ({ tipo }) => {
  switch (tipo) {
    case "gavel":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 3.5 20.5 9.5" />
          <path d="M11.8 6.2 17.8 12.2" />
          <path d="M3.5 14.5 9 20" />
          <path d="M2 21h9" />
          <path d="m8 8.5-6 6" />
        </svg>
      );
    case "mapa":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
      );
    case "alimento":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c1.4 1.4 1.8 3.2.5 4.5" />
          <path d="M12 8c-4.5 0-7.5 3.4-7.5 7.2C4.5 18.8 7.6 21 11 21c1 0 1-.6 1-1s0-1 1-1 1 .6 1 1 0 1 1 1c3.4 0 6.5-2.2 6.5-5.8C20.5 11.4 16.5 8 12 8Z" />
        </svg>
      );
    case "etiqueta":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.5 3.5H6A2 2 0 0 0 4 5.5V12a2 2 0 0 0 .6 1.4l8 8a2 2 0 0 0 2.8 0l6-6a2 2 0 0 0 0-2.8l-8-8a2 2 0 0 0-1-.3Z" />
          <circle cx="8.3" cy="8.3" r="1.4" />
        </svg>
      );
    default:
      return null;
  }
};

const IconExterno = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 10.8v5.2" />
    <path d="M12 7.8h.01" />
  </svg>
);

function ResolucaoCard({ item }) {
  return (
    <div className="leg-card">
      <div className="leg-card-top">
        <span className="leg-card-numero">{item.numero}</span>
      </div>
      <h4 className="leg-card-titulo">{item.titulo}</h4>
      <p className="leg-card-desc">{item.descricao}</p>

      {item.link ? (
        <a
          className="leg-card-action"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver fonte oficial
          <IconExterno />
        </a>
      ) : (
        <span
          className="leg-card-action leg-card-action--disabled"
          title="Cadastre o link oficial desta resolução"
        >
          Fonte oficial a cadastrar
        </span>
      )}
    </div>
  );
}

export default function Legislacao({ embedded = false }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("federal");
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const navigate = useNavigate();

  const handleVoltar = () => navigate("/funcionario/home");

  const estadosOrdenados = [...ESTADOS].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );
  const estadoAtual = ESTADOS.find((e) => e.sigla === estadoSelecionado);

  let listaResolucoes = [];
  if (categoriaAtiva === "estadual") {
    listaResolucoes = estadoAtual ? gerarLegislacaoEstadual(estadoAtual) : [];
  } else {
    listaResolucoes = legislacaoPorCategoria[categoriaAtiva] || [];
  }

  const conteudo = (
    <div className="leg-container">
      <div className="leg-header">
        <h2>Legislação de Alimentos e Rotulagem</h2>
        <p>Navegue pelas categorias abaixo para consultar as normas aplicáveis.</p>
      </div>

      <div className="leg-aviso">
        <IconInfo />
        <span>
          Conteúdo ilustrativo. Substitua os itens de exemplo pelas resoluções e links
          oficiais definitivos.
        </span>
      </div>

      <nav className="leg-tabs">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`leg-tab ${categoriaAtiva === cat.key ? "active" : ""}`}
            onClick={() => setCategoriaAtiva(cat.key)}
          >
            <IconCategoria tipo={cat.icone} />
            {cat.label}
          </button>
        ))}
      </nav>

      {categoriaAtiva === "estadual" && (
        <div className="leg-select-wrap">
          <label htmlFor="leg-estado-select">Estado</label>
          <select
            id="leg-estado-select"
            className="leg-select"
            value={estadoSelecionado}
            onChange={(e) => setEstadoSelecionado(e.target.value)}
          >
            <option value="">Selecione um estado...</option>
            {estadosOrdenados.map((estado) => (
              <option key={estado.sigla} value={estado.sigla}>
                {estado.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      {categoriaAtiva === "estadual" && !estadoSelecionado ? (
        <div className="leg-empty-state">
          <p>Selecione um estado acima para ver a legislação referente a ele.</p>
        </div>
      ) : (
        <div className="leg-grid">
          {listaResolucoes.map((item) => (
            <ResolucaoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return conteudo;
  }

  return (
    <div className="leg-page">
      <button className="btn-voltar" type="button" onClick={handleVoltar}>
        ← Voltar para o Início
      </button>
      {conteudo}
    </div>
  );
}
