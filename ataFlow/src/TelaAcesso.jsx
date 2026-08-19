import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "./supabaseClient";
import HomeFuncionario from "./abaFuncionario/homeFuncionario/HomeFuncionario";
import HomeAdmin from "./abaRh/HomeAdmin";
import Swal from 'sweetalert2';
import "./TelaAcesso.css";
import loginVisual from "./assets/login-inspiracao.jpg";

export default function Telaacesso() {
  const { register, handleSubmit } = useForm();
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [logadoRh, setLogadoRh] = useState(false);
  const [logadoFuncionario, setLogadoFuncionario] = useState(false);

  if (logadoRh) {
    return <HomeAdmin></HomeAdmin>;
  }

  if (logadoFuncionario) {
    return <HomeFuncionario></HomeFuncionario>;
  }
  const realizarLogin = async (dados) => {
    setCarregando(true);
    setErro("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dados.email,
        password: dados.senha,
      });

      if (error) {
        setErro("E-mail ou senha inválidos.");
        setCarregando(false);
        return;
      }

      const usuarioLogadoId = data.user.id;

      const {
        data: perfil,
        error: perfilError,
        status,
      } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", usuarioLogadoId)
        .maybeSingle();

      console.log("Status da resposta:", status);

      if (perfilError) {
        setCarregando(false);
        return;
      }

      if (!perfil) {
        setErro(
          'Usuário autenticado, mas nenhum registro correspondente foi encontrado na tabela "users".',
        );
        setCarregando(false);
        return;
      }

      await Swal.fire({
        icon: 'success',
        iconColor: '#14141a',
        title: `Bem-vindo(a), ${perfil.nome}!`,
        text: `Login realizado com sucesso como ${perfil.categoria}.`,
        background: '#ffffff',
        color: '#17181c',
        confirmButtonColor: '#14141a',
        customClass: {
          popup: 'ataflow-swal-popup',
          confirmButton: 'ataflow-swal-confirm',
        },
        timer: 2000,
      });

      const categoriaFormatada = perfil.categoria
        ? perfil.categoria.toLowerCase()
        : "";

      if (
        categoriaFormatada === "funcionario" ||
        categoriaFormatada === "funcionaria"
      ) {
        console.log("Redirecionando para a tela do Funcionário");
        setLogadoFuncionario(true);
      } else if (
        categoriaFormatada === "rh" ||
        categoriaFormatada === "admin" ||
        categoriaFormatada === "administrador"
      ) {
        console.log("Redirecionando para a tela do RH");
        setLogadoRh(true);
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setErro("Ocorreu um erro inesperado ao tentar fazer o login.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <aside className="login-visual">
        <div className="login-visual-brand">
          
          AtaFlow
        </div>

        <div className="login-visual-copy">
          <h2>Organize atas, presença e folha em um só lugar.</h2>
         
        </div>

        
      </aside>

      <div className="login-panel">
        <div className="login-box">
          <header className="login-header">
            <h1>Bem-vindo(a) ao AtaFlow</h1>
            <p>Acesse sua conta para continuar</p>
          </header>

          {erro && <p className="error-message">{erro}</p>}

          <form className="login-form" onSubmit={handleSubmit(realizarLogin)}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="seu.email@empresa.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                {...register("senha", { required: true })}
                type="password"
                id="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button className="btn-login" type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Acessar Sistema"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
