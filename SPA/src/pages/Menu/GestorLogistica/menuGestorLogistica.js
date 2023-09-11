import './menuGestorLogistica.css';
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestDecodeToken } from '../../../services/checkSession';
import { requestDecodeTokenUsername } from '../../../services/checkSession';

const MenuGestorLogistica = () => {

    const [username, setUsername]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeLogistica");

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
            <div className="main-menu-gestorLogistica">   
                <div className="card-menu-gestorLogistica">
                    <h1>MENU DO GESTOR DE LOGÍSTICA</h1>
                        <Link to="/percurso/criar">
                            <button className="btn-menu-listar-percurso" >Criar Percurso</button>
                        </Link>
                        <Link to="/percurso/listar">
                            <button className="btn-menu-listar-percurso" >Listar Percurso</button>
                        </Link>
                        <Link to="/planeamento">
                            <button className="btn-menu-listar-percurso" >Obter Planeamento</button>
                        </Link>
                        <button className="btn-menu-listar-percurso" onClick={cancelarConta} >Cancelar Própria Conta</button>
                </div>
                <button className="btn-logout" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main> 
        );       
    }

export default MenuGestorLogistica;