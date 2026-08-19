import React from 'react';
import '../HomeAdmin.css';
import '../ModulosAdmin.css';
import HomeAdmin from '../HomeAdmin';

export default function VisualizacaoFuncionarias() {
    
     
  return (
    
    <div className="painel-box">
        
      <div className="modulo-header">
        <h4>Colaboradoras Cadastradas</h4>
      
      </div>

      <table className="tabela-atas">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo / Função</th>
            <th>E-mail</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Funcionária Exemplo 1</strong></td>
            <td>Consultora de Alimentos</td>
            <td>funcionaria1@exemplo.com</td>
            <td><span className="status-badge">Ativa</span></td>
            <td><button className="btn-tabela-link" type="button">Editar</button></td>
          </tr>
          <tr>
            <td><strong>Funcionária Exemplo 2</strong></td>
            <td>Auditora Operacional</td>
            <td>funcionaria2@exemplo.com</td>
            <td><span className="status-badge">Ativa</span></td>
            <td><button className="btn-tabela-link" type="button">Editar</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}