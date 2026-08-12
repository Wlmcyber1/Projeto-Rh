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

  //adicionar restrições.

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/admin/home")
    //obriga o usuario digitar e tira os espaços
    if (!nomeEmpresa.trim()) {
      alert("Por favor, informe o nome da empresa.");
      return;
    }

    setCarregando(true);

    try {
      // tenta salvar a nova empresa lá na tabela 'empresas' do Supabase
      const { data, error } = await supabase
        .from("empresas") // Seleciona a tabela 'empresas'
        .insert([
          {
            nome: nomeEmpresa, // Salva o nome vindo do input
            cnpj: cnpj, // Salva o CNPJ vindo do input
          },
        ]);

      //  se o Supabase responder com algum erro , lança direto pro 'catch'
      if (error) throw error;

      // se deu tudo certo!
      await Swal.fire({
        icon: "success",
        title: `Empresa cadastrada com sucesso`,
        text: ``,
        confirmButtonColor: "#0284c7",
        timer: 2000, // Fecha automaticamente após 2 segundos
      });

      // executa a função do pai (se ela existir) para atualizar a lista de empresas na tela em tempo real
      if (onEmpresaAdicionada) onEmpresaAdicionada();

      // fecha a janela/modal do formulário
      if (onClose) onClose();
    } catch (error) {
      // caso aconteça qualquer falha de conexão ou no banco, o erro é exibido aqui
      console.error("Erro ao cadastrar empresa:", error.message);
      alert(
        "Erro ao cadastrar a empresa. Verifique o console para mais detalhes.",
      );
    } finally {
      // o 'finally' executa SEMPRE no final, dando certo ou errado, para desativar o carregamento
      setCarregando(false);
    }

    // tempo de carregamento
    setTimeout(() => {
      setCarregando(false);
      if (onEmpresaAdicionada) onEmpresaAdicionada();
      if (onClose) onClose();
    }, 1000);
  };

  

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Cabeçalho */}
        <div className="modal-header">
          <h2>Cadastrar Nova Empresa</h2>
          <button className="btn-close" onClick={onClose} aria-label="Fechar">
            &times;
          </button>
        </div>

        {/* Formulário */}
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

          {/* Ações do Rodapé */}
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
