import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
        <Route path="/" element={<TelaAcesso />} />
        <Route path="/funcionario/home" element={<HomeFuncionario />} />
        
        <Route
          path="/funcionario/registrar-visita"
          element={<RegistrarVisita />}
        />
        <Route path="/funcionario/legislacao" element={<Legislacao />} />
        <Route path="/admin/home" element={<HomeAdmin />} />
        <Route path="/adicionarEmpresa" element={<AdicionarEmpresa />} />
        <Route path="/gerar-pdf" element={<Pdf />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
