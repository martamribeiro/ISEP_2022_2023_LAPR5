import React, { useState, useEffect  } from "react";

export async function sendRequest(pathUtilizadores, flag, password) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    const responseUtilizadores = await fetch("http://localhost:3000/api/utilizadores" + pathUtilizadores, requestOptions);
    const utilizador = await responseUtilizadores.json();

    requestCheckIfPasswordsMatch(utilizador, password, requestOptions, flag);
}

export async function requestCheckIfPasswordsMatch(utilizador, password, requestOptions, flag){
    let userEmail = utilizador.email;
    let userRole = utilizador.funcaoUtilizador;
    let username = utilizador.username;

    if(flag){
        const pathPasswordsCoincidem = "/passwordsCoincidem/" + userEmail + "/" + password;
    
        const responsePasswordsCoincidem = await fetch("http://localhost:3000/api/utilizadores" + pathPasswordsCoincidem, requestOptions);
        const passwordsCoincidem = await responsePasswordsCoincidem.json();

        if(passwordsCoincidem){
            await requestGenerateToken(username, requestOptions);
            switch(userRole){
                case "administradorDeSistema":
                    window.location.replace("/menuAdministrador");
                    break;
                case "gestorDeArmazem":
                    window.location.replace("/armazem/menu");
                    break;
                case "gestorDeFrota":
                    window.location.replace("/menuGestorFrota");
                    break;
                case "gestorDeLogistica":
                    window.location.replace("/menuGestorLogistica");
                    break;
                default:
                    window.location.replace("/menuAdministrador");
            }
        }else{
            window.alert("Credenciais erradas.");
        }
    }else{
        await requestGenerateToken(username, requestOptions);
        switch(userRole){
            case "administradorDeSistema":
                window.location.replace("/menuAdministrador");
                break;
            case "gestorDeArmazem":
                window.location.replace("/armazem/menu");
                break;
            case "gestorDeFrota":
                window.location.replace("/menuGestorFrota");
                break;
            case "gestorDeLogistica":
                window.location.replace("/menuGestorLogistica");
                break;
            default:
                window.location.replace("/menuAdministrador");
        }
    }
}

export async function requestGenerateToken(username, requestOptions){
    console.log("Checkpoint");
    const pathGerarToken = "/gerarToken/" + username;
    
    const responseGerarToken = await fetch("http://localhost:3000/api/utilizadores" + pathGerarToken, requestOptions);
    const token = await responseGerarToken.json();

    localStorage.setItem('userToken', token);
}