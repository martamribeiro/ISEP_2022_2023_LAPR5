import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from 'react-router';
import CriarArmazem from "./pages/Armazem/CriarArmazem/criarArmazem"
import CriarEntrega from "./pages/Entrega/CriarEntrega/criarEntrega"
import ListarEntrega from './pages/Entrega/ListarEntrega/listarEntrega';
import CriarCamiao from './pages/Camiao/CriarCamiao/criarCamiao';
import Login from "./pages/Login/login"
import CriarPercurso from './pages/Percurso/CriarPercurso/criarPercurso';
import ListarPercurso from './pages/Percurso/ListarPercurso/listarPercurso';
import ListarCamiao from './pages/Camiao/ListarCamiao/listarCamiao';
import ListarArmazem from './pages/Armazem/ListarArmazem/listarArmazem';
import ArmazemMenuPrincipal from './pages/Menu/GestorArmazens/menuPrincipal';
import MenuGestorLogistica from './pages/Menu/GestorLogistica/menuGestorLogistica';
import EntregaMenuPrincipal from './pages/Entrega/menuPrincipal';
import HeuristicaArmazem from './pages/Planeamento/heuristicaArmazem';
import MenuGestorFrota from './pages/Menu/GestorFrota/menuGestorFrota';
import RedeViaria from './pages/Mapa/reactIntegration.js';
import InibirDesinibirCamiao from './pages/Camiao/InibirDesinibirCamiao/inibirDesinibirCamiao';
import CriarConta from './pages/Conta/CriarConta/criarConta';
import ListarViagens from './pages/Viagem/listarViagens';
import MenuAdministrador from './pages/Menu/Administrador/menuAdministrador';
import CancelarConta from './pages/Conta/CancelarConta/cancelarConta';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/entrega/criar' element={<CriarEntrega/>}/>
        <Route path='/criarArmazem' element={<CriarArmazem/>}/>
        <Route path='/percurso/criar' element={<CriarPercurso/>}/>
        <Route path='/camiao/criar' element={<CriarCamiao/>}/>
        <Route path='/percurso/listar' element={<ListarPercurso/>}/>
        <Route path='/entrega/listar' element={<ListarEntrega/>}/>
        <Route path='/camiao/listar' element={<ListarCamiao/>}/>
        <Route path='/armazem/listar' element={<ListarArmazem/>}/>
        <Route path='/armazem/menu' element={<ArmazemMenuPrincipal/>}/>
        <Route path='/entrega/menu' element={<EntregaMenuPrincipal/>}/>
        <Route path='/menuGestorLogistica' element={<MenuGestorLogistica/>}/>
        <Route path='/planeamento' element={<HeuristicaArmazem/>}/>
        <Route path='/menuGestorFrota' element = {<MenuGestorFrota/>}/>
        <Route path='/menuAdministrador' element = {<MenuAdministrador/>}/>
        <Route path='/redeViaria' element = {<RedeViaria/>}/>
        <Route path='/camiao/inibir' element = {<InibirDesinibirCamiao/>}/>
        <Route path='/criarConta' element= {<CriarConta/>}/>
        <Route path='/viagens/listar' element={<ListarViagens/>}/>
        <Route path='/cancelarConta' element= {<CancelarConta/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
