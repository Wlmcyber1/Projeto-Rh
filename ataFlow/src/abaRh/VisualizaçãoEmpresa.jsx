import React, { useEffect, useState } from "react";
import "./HomeAdmin.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function VisualizacaoEmpresas() {
  const [nomeEmpresa, setEmpresa] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();
  const buscarEmpresas = async () => {
    try {

      setCarregando(true)
     
        // busca o nome do usuário correspondente na tabela "empresa"
        const { data, error} = await supabase
          //pegue o que veio em data e salve com o apelido de empresa
          .from("empresas")
          //vá para tabela empresa
          .select("nome, id, cnpj")
          //selecione a coluna nome
          .order("id", {ascending:true});
       
        if(error) throw error; 

        if(data){
          setEmpresa(data)
        }
        
      
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
    finally{
      setCarregando(false)
    }
  };

 
 useEffect(()=>{
  buscarEmpresas()
 }, [])

  const handleTelaAdicionarEmpresa = () => {
    navigate("adicionarEmpresa");
  };
  return (
   <div className="painel-box">
      
      {/* Cabeçalho do Módulo */}
      <div className="modulo-header">
        <div>
          <h4>Empresas / Clientes Parceiros</h4>
          <p className="modulo-subtitulo">Gerenciamento de contratos e limites de visitas mensais.</p>
        </div>
        <button className="btn-acao-principal" type="button" onClick={handleTelaAdicionarEmpresa}>
          + Cadastrar Empresa
        </button>
      </div>

      {/* Tabela de Empresas Dinâmica */}
      <table className="tabela-atas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome / Razão Social</th>
            <th>CNPJ</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Se estiver carregando, mostra uma mensagem */}
          {carregando ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Carregando empresas...</td>
            </tr>
          ) : nomeEmpresa.length === 0 ? (
            /* Se não houver empresas cadastradas */
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma empresa cadastrada.</td>
            </tr>
          ) : (
            /* mapeando os valores */
            nomeEmpresa.map((emp) => (
              <tr key={emp.id}>
                <td><strong>#{emp.id}</strong></td>
                <td>{emp.nome}</td>
                <td>{emp.cnpj || 'Não informado'}</td>
                <td>
                  <span className="status-badge">Ativo</span>
                </td>
                <td>
                  <button className="btn-tabela-link" type="button">Editar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
