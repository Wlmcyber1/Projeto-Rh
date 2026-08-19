import React, { useState } from 'react';
import './HomeAdmin.css'; 
import './ModulosAdmin.css';
import HomeAdmin from './HomeAdmin';

export default function VisualizacaoAtas() {
  

  return (
    <div className="painel-box">
     

      <div className="modulo-header">
        <h4>Histórico de Atas de Visitas</h4>
        
        <div className="filtros-container">
          <select className="seletor-filtro">
            <option>Filtrar por Funcionária...</option>
            <option>Funcionária Exemplo 1</option>
            <option>Funcionária Exemplo 2</option>
            <option>Funcionária Exemplo 3</option>
          </select>

          <select className="seletor-filtro">
            <option>Filtrar por Empresa...</option>
            <option>Empresa Exemplo A (25)</option>
            <option>Empresa Exemplo B (14)</option>
            <option>Empresa Exemplo C (12)</option>
          </select>
        </div>
      </div>

      <div className="painel-destaque-horas">
        <p>Resumo de Operação Filtrada</p>
        <h5>
          Total acumulado no período: 
          <span className="destaque-numero">12.5 horas</span>
        </h5>
      </div>

      <table className="tabela-atas">
        <thead>
          <tr>
            <th>Data</th>
            <th>Funcionária</th>
            <th>Empresa / Operação</th>
            <th>Período Escaneado</th>
            <th>Total Horas</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>13/07/2026</td>
            <td>Funcionária Exemplo 1</td>
            <td>Empresa Exemplo A (25)</td>
            <td>14:00 - 16:30</td>
            <td>2.5h</td>
            <td><span className="status-badge">Concluído</span></td>
          </tr>
          <tr>
            <td>12/07/2026</td>
            <td>Funcionária Exemplo 1</td>
            <td>Empresa Exemplo B (14)</td>
            <td>13:15 - 15:45</td>
            <td>2.5h</td>
            <td><span className="status-badge">Concluído</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}