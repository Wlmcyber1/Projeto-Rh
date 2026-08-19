import React, { useState } from "react";
import "./AdicionarEmpresa.css";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export default function AdicionarEmpresa({ onClose, onEmpresaAdicionada }) {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [status, setStatus] = useState("ativo");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/admin/home")
    if (!nomeEmpresa.trim()) {
      alert("Por favor, informe o nome da empresa.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase
        .from("empresas")
        .insert([
          {
            nome: nomeEmpresa,
            cnpj: cnpj,
          },
        ]);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: `Empresa cadastrada com sucesso`,
        text: ``,
        confirmButtonColor: "#0284c7",
        timer: 2000,
      });

      if (onEmpresaAdicionada) onEmpresaAdicionada();

      if (onClose) onClose();
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error.message);
      alert(
        "Erro ao cadastrar a empresa. Verifique o console para mais detalhes.",
      );
    } finally {
      setCarregando(false);
    }

    setTimeout(() => {
      setCarregando(false);
      if (onEmpresaAdicionada) onEmpresaAdicionada();
      if (onClose) onClose();
    }, 1000);
  };

  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Cadastrar Nova Empresa</h2>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="empresa-form">
          <div className="form-group">
            <label htmlFor="nomeEmpresa">
              Nome da Empresa / Operação <span className="required">*</span>
            </label>
            <input
              id="nomeEmpresa"
              type="text"
              placeholder="Ex: Churrascaria Lopes"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              disabled={carregando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cnpj">CNPJ / Identificador (Opcional)</label>
            <input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0001-00"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status Inicial</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={carregando}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onClose}
              disabled={carregando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-salvar"
             
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Cadastrar Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
