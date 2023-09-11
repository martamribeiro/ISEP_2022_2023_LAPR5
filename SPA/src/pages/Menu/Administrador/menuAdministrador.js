import './menuAdministrador.css';
import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { requestDecodeTokenUsername } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';

const MenuAdministrador = () => {

    const [username, setUsername]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "administradorDeSistema");

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
            <div className="main-menu-administrador">   
                <div className="card-menu-administrador">
                    <h1>MENU DO ADMINISTRADOR</h1>
                        <Link to="/criarConta">
                            <button className="btn-menu-criar-conta">Criar Conta</button>
                        </Link>
                        <Link to="/cancelarConta">
                            <button className="btn-menu-cancelar-conta" >Cancelar Contas de Utilizadores</button>
                        </Link>
                        <button className="btn-menu-cancelar-propria-conta" onClick={cancelarConta} >Cancelar Própria Conta</button>
                </div>
                <button className="btn-logout" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main> 
    );       
}

export default MenuAdministrador;