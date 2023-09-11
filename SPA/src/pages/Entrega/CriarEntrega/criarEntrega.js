import './criarEntrega.css';
import React, {useEffect} from "react";
import Home from '../../../imagens/home.png';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import {Link } from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { useState } from 'react';

const CriarEntrega = () => {

    const [idArmazem, setIdArmazem]=useState('');
    const [dataEntrega,setDataEntrega]=useState('');
    const [peso,setPeso]=useState('');
    const [tempoCarregamento, setTempoCarregamento]=useState('');
    const [tempoDescarregamento, setTempoDescarregamento]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeArmazem");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    function onCreateEntrega () {
        const entregaInfo= JSON.stringify({
            idArmazem:{
                value: idArmazem
            },
            dataEntrega: dataEntrega,
            peso: peso,
            tempoCarregamento: tempoCarregamento,
            tempoDescarregamento: tempoDescarregamento
        });

        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: entregaInfo,
            redirect: 'follow'
        };

        fetch("https://localhost:5001/api/Entrega/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
            /*.catch(window.alert("Os dados introduzidos não possibilitam a criação de uma Entrega! Introduza os dados novamente. \n" + 
            "Siga os seguintes formatos:\n" +
            "\t-Id de Armazém: minimo de 1 e máximo de 3 caracteres;\n" +
            "\t-Data de Entrega: data futura, com formato AAAAMMDD;\n" +
            "\t-Peso: número positivo;\n" +
            "\t-Tempo de Carregamento: número positivo;\n"+
            "\t-Tempo de Descarregamento: número positivo."));*/

    }


        

        return (
        <main>
            <div className="main-entrega">   
                <div className="card-entrega">
                    <h1>CRIAR ENTREGA</h1>
                    <div className="textfield-entrega">
                        <label>ID de Armazém</label>
                        <input id="inputArmazem" type="text" className="inputEntrega" onChange={(e=>setIdArmazem(e.target.value))}/>
                    </div>
                    <div className="textfield-entrega">
                        <label>Data de Entrega</label>
                        <input id="inputData" type="text" className="inputEntrega" onChange={(e=>setDataEntrega(e.target.value))}/>
                    </div>
                    <div className="textfield-entrega">
                        <label>Peso</label>
                        <input id="inputPeso" type="number" step="0.01" className="inputEntrega" onChange={(e=>setPeso(e.target.value))} min={0}/>
                    </div>
                    <div className="textfield-entrega">
                        <label>Tempo de Carregamento</label>
                        <input id="inputTempoCarregamento" type="number" step="0.01" className="inputEntrega" onChange={(e=>setTempoCarregamento(e.target.value))} min={0}/>
                    </div>
                    <div className="textfield-entrega">
                        <label>Tempo de Descarregamento</label>
                        <input id="inputTempoDescarregamento" type="number" step="0.01" className="inputEntrega" onChange={(e=>setTempoDescarregamento(e.target.value))} min={0}/>
                    </div>
                    <button id="btn-criar-entrega" className="btn-criar-entrega" onClick={onCreateEntrega}>Criar</button>
                </div>
                <div>
                    <button className="btn-home-entrega" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                    <Link to="/armazem/menu">
                    <button className="btn-entrega" ><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link></div>
            </div>
        </main>
        );
    }

    export default CriarEntrega;


