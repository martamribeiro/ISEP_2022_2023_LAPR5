import './menuPrincipal.css';
import React, {useEffect, useState} from "react";
import {Link } from "react-router-dom";
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestDecodeToken } from '../../../services/checkSession';
import { requestDecodeTokenUsername } from '../../../services/checkSession';

const MenuPrincipal = () => {

    const [username, setUsername]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeArmazem");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    useEffect(() => {
        const getUsernameUtilizador = async () => {
            const responseUsernameUtilizador = await requestDecodeTokenUsername(localStorage.getItem('userToken'));
            setUsername(responseUsernameUtilizador);
        }

        getUsernameUtilizador();
    });

    async function cancelarConta(){
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/api/utilizadores/cancelarConta", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch((error) => {window.alert("Erro ao cancelar a conta.")})
    }

    return (
        <main>
            <div className="main-menu-armazem">   
                <div className="card-menu-armazem">
                    <h1>MENU GESTOR DE ARMAZEM</h1>
                    <Link to="/criarArmazem">
                        <button className="btn-menu-criar-armazem" >Criar Armazem</button>
                    </Link>
                    <Link to="/armazem/listar">
                        <button className="btn-menu-criar-armazem" >Listar Armazem</button>
                    </Link>
                    <Link to="/entrega/criar">
                        <button className="btn-menu-criar-armazem" >Criar Entrega</button>
                    </Link>
                    <Link to="/entrega/listar">
                        <button className="btn-menu-criar-armazem" >Listar Entrega</button>
                    </Link>
                    <button className="btn-menu-criar-armazem" onClick={cancelarConta} >Cancelar Própria Conta</button>
                </div>
                <button className="btn-logout" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main> 
        );       
}

export default MenuPrincipal;