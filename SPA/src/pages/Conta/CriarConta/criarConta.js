import './criarConta.css';
import React from "react";
import Home from '../../../imagens/home.png';
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestCriarUtilizador } from '../../../controllers/criarContaController';

const CriarConta = () => {
    const[username, setUsername]=useState('');
    const[email, setEmail]=useState('');
    const[primeiroNome, setPrimeiroNome]=useState('');
    const[ultimoNome, setUltimoNome]=useState('');
    const[password, setPassword]=useState('');
    const[numeroTelefone, setNumeroTelefone]=useState('');
    const[repeatedPassword, setRepeatedPassword]=useState('');
    const[opcaoFuncaoUtilizador, setOpcaoFuncaoUtilizador]=useState("administradorDeSistema");

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "administradorDeSistema");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    const selectFuncaoUtilizador = (e) => {
        let inputOpcaoFuncaoUtilizador = e.target.value;
        setOpcaoFuncaoUtilizador(inputOpcaoFuncaoUtilizador);
    }

    const convertEmail = (e) => {
        let convertedEmail = document.getElementById("inputEmail");

        setEmail(convertedEmail.value);
    }

    function togglePasswordVisibilty(){
        let passwordVisibility = document.getElementById("inputPassword");
        let repeatedPasswordVisibility = document.getElementById("inputRepeatedPassword");

        if(passwordVisibility.type === "password" && repeatedPasswordVisibility.type === "password"){
            passwordVisibility.type = "text";
            repeatedPasswordVisibility.type = "text";
        }else{
            passwordVisibility.type = "password";
            repeatedPasswordVisibility.type = "password";
        }
    }

    function createUtilizador(){
        if(password === repeatedPassword){
            createUtilizadorPOST();
        }else{
            window.alert("As passwords não coincidem.")
        }
    }

    async function createUtilizadorPOST(){
        let funcaoUtilizador;
        
        if(opcaoFuncaoUtilizador === "administradorDeSistema"){
            funcaoUtilizador = "administradorDeSistema";
        }else if(opcaoFuncaoUtilizador === "gestorDeArmazem"){
            funcaoUtilizador = "gestorDeArmazem";
        }else if(opcaoFuncaoUtilizador === "gestorDeFrota"){
            funcaoUtilizador = "gestorDeFrota";
        }else if(opcaoFuncaoUtilizador === "gestorDeLogistica"){
            funcaoUtilizador = "gestorDeLogistica";
        }

        await requestCriarUtilizador(username, email, primeiroNome, ultimoNome, password, numeroTelefone, funcaoUtilizador);
        
        window.location.reload();
    }

    return(
        <main>
            <div className="main-utilizador">   
                <div className="card-utilizador">
                    <h1>CRIAR CONTA</h1>
                    <div className="textfield-utilizador">
                        <label>Primeiro Nome</label>
                        <input id="inputPrimeiroNome" type="text" className="inputUtilizador" onChange={(e=>setPrimeiroNome(e.target.value))}/>
                    </div>
                    <div className="textfield-utilizador">
                        <label>Último Nome</label>
                        <input id="inputUltimoNome" type="text" className="inputUtilizador" onChange={(e=>setUltimoNome(e.target.value))}/>
                    </div>  
                    <div className="textfield-utilizador">
                        <label>Username</label>
                        <input id="inputUsername" type="text" className="inputUtilizador" onChange={(e=>setUsername(e.target.value))}/>
                    </div>
                    <div className="textfield-utilizador">
                        <label>Email</label>
                        <input id="inputEmail" type="text" className="inputUtilizador" onChange={convertEmail}/>
                    </div>
                    <div className="textfield-utilizador">
                        <label>Password</label>
                        <input id="inputPassword" type="password" className="inputUtilizador" onChange={(e=>setPassword(e.target.value))}/>
                    </div>
                    <div className="textfield-utilizador">
                        <label>Repeat Password</label>
                        <input id="inputRepeatedPassword" type="password" className="inputUtilizador" onChange={(e=>setRepeatedPassword(e.target.value))}/>
                    </div>
                    <div className="checkbox-password-criar-conta">
                        <input type="checkbox" onClick={togglePasswordVisibilty}/>Show Password
                    </div>
                    <div className="textfield-utilizador">
                        <label>Número de Telefone</label>
                        <input id="inputNumeroTelefone" type="number" className="inputUtilizador" onChange={(e=>setNumeroTelefone(e.target.value))}/>
                    </div>
                    <div className="textfield-utilizador">
                        <label>Função</label>
                        <select id="opcoes-funcao-utilizador" className="opcoes-funcao-utilizador" onChange={selectFuncaoUtilizador}>
                            <option value="administradorDeSistema">Administrador de Sistema</option>
                            <option value="gestorDeArmazem">Gestor de Armazém</option>
                            <option value="gestorDeFrota">Gestor de Frota</option>
                            <option value="gestorDeLogistica">Gestor de Logística</option>
                        </select>
                    </div>
                    <button id="btn-criar-utilizador" className="btn-criar" onClick={createUtilizador}>Criar</button>
                </div>
                <Link to="/menuAdministrador">
                    <button className="btn-home"><img src={Home} alt="description" height ="70" width="70"/></button>
                </Link>
                <button className="btn-logout-criar-conta" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main>
    )
}

export default CriarConta;