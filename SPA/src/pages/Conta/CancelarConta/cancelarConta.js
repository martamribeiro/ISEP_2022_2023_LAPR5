import './cancelarConta.css';
import React from "react";
import Home from '../../../imagens/home.png';
import { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestCancelarConta } from '../../../controllers/cancelarContaController';

const CancelarConta = () => {
    const[username, setUsername]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "administradorDeSistema");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    async function cancelUtilizadorPUT(){
        await requestCancelarConta(username);
    }

    return(
        <main>
            <div className="main-cancelar">   
                <div className="card-cancelar">
                    <h1>CANCELAR CONTA</h1>
                    <div className="textfield-cancelar">
                        <label>Username</label>
                        <input id="inputUsername" type="text" className="inputUtilizador" onChange={(e=>setUsername(e.target.value))}/>
                    </div>
                    
                    
                    
                    <button id="btn-cancelar" className="btn-cancelar" onClick={cancelUtilizadorPUT}>Cancelar</button>
                </div>
                <Link to="/menuAdministrador">
                    <button className="btn-home-cancelar"><img src={Home} alt="description" height ="70" width="70"/></button>
                </Link>
                <button className="btn-logout-cancelar-conta" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main>
    )
}

export default CancelarConta;