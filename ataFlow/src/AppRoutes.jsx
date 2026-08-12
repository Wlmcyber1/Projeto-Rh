import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importe suas telas aqui
import TelaAcesso from "../src/TelaAcesso";
import HomeFuncionario from "../src/abaFuncionario/homeFuncionario/HomeFuncionario";
import RegistrarVisita from "../src/abaFuncionario/RegistrarVisita";
import HomeAdmin from "../src/abaRh/HomeAdmin";
import AdicionarEmpresa from "./abaRh/AdicionarEmpresa";
import Pdf from "./Pdf";
import Legislacao from "./Legislacao";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial (Login) */}
        <Route path="/" element={<TelaAcesso />} />
        {/* Rotas do Funcionário */}
        <Route path="/funcionario/home" element={<HomeFuncionario />} />
        
        <Route
          path="/funcionario/registrar-visita"
          element={<RegistrarVisita />}
        />
        <Route path="/funcionario/legislacao" element={<Legislacao />} />
        {/* Rotas do RH / Admin */}
        <Route path="/admin/home" element={<HomeAdmin />} />
        <Route path="/adicionarEmpresa" element={<AdicionarEmpresa />} />
        <Route path="/gerar-pdf" element={<Pdf />} />
        
        {/* Redireciona qualquer URL desconhecida para o Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
