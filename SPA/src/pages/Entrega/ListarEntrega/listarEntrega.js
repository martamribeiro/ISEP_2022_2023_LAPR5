import './listarEntrega.css';
import Home from '../../../imagens/home.png';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import React from 'react';
import { useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';

const ListarEntrega = () => {

    const [idArmazemInput,setIdArmazem]=useState('');
    const [dataInicialInput,setDataInicial]=useState('');
    const [dataFinalInput,setDataFinal]=useState('');
    const [opcao, setOpcao]=useState('todos');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeArmazem");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    function atualizarOpcao() {
        let opcaoSelecionada = document.getElementById("opcoes-entrega").value;
        setOpcao(opcaoSelecionada);
        let inputIdArmazem = document.getElementById("idArmazemInput");
        let inputDataInicial = document.getElementById("dataInicialInput");
        let inputDataFinal = document.getElementById("dataFinalInput");
        if(opcaoSelecionada === 'todos') {
            //limparDados();
            inputIdArmazem.setAttribute('readonly', true);
            inputDataInicial.setAttribute('readonly', true);
            inputDataFinal.setAttribute('readonly', true);
        } else if(opcaoSelecionada === 'porIdArmazem') {
            //limparDados();
            inputIdArmazem.removeAttribute('readonly');
            inputDataInicial.setAttribute('readonly', true);
            inputDataFinal.setAttribute('readonly', true);
        } else if(opcaoSelecionada === 'porDatas'){
            //limparDados();
            inputDataInicial.removeAttribute('readonly');
            inputDataFinal.removeAttribute('readonly');
            inputIdArmazem.setAttribute('readonly', true);
        } else {
            inputDataInicial.removeAttribute('readonly');
            inputDataFinal.removeAttribute('readonly');
            inputIdArmazem.removeAttribute('readonly');
        }
    }

    async function listarEntrega() {
        let path;
        if(opcao === 'todos') {
            path = '';
        } else if(opcao === 'porIdArmazem') {
            path = '/porIdArmazem?idArmazem=' + idArmazemInput;
        } else if(opcao === 'porDatas') {
            path = '/porDatas?data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        } else {
            path = '/porIdArmazemEDatas?idArmazem=' + idArmazemInput + '&data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const response = await fetch("https://localhost:5001/api/Entrega" + path, requestOptions)

        if(response.status===200){
            const entregas = await response.json();

            //no caso de ser necessário apagar a tabela
            const output = document.getElementById("output-entrega");
            while (output.rows.length > 1) {
                output.deleteRow(-1);
            }

            let myMap = new Map(Object.entries(entregas));
            console.log(myMap);
            
            for (let niveis = 0; niveis < myMap.size; niveis++){
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + myMap.get(''+ niveis).id + '</td>' +
                '<td>' + myMap.get(''+ niveis).idArmazem.value + '</td>' +
                '<td>' + myMap.get(''+ niveis).dataEntrega + '</td>' +
                '<td>' + myMap.get(''+ niveis).peso + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoCarregamento + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoDescarregamento + '</td>'
                ;
                output.appendChild(tr);
            }

        } else {
            window.alert("Ocorreu um erro ao encontrar as Entregas! Por favor tente novamente.");
        }
    }

    async function listarEntregaOrdenarIdArmazem() {
        let path;
        if(opcao === 'todos') {
            path = '/idArmazemAscendente'; //comentado no controller
        } else if(opcao === 'porIdArmazem') {
            path = '/porIdArmazem?idArmazem=' + idArmazemInput;
        } else if(opcao === 'porDatas') {
            path = '/porDatasIdArmazemAscendente?data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        } else {
            path = '/porIdArmazemEDatasIdArmazemAscendente?idArmazem=' + idArmazemInput + '&data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const response = await fetch("https://localhost:5001/api/Entrega" + path, requestOptions)

        if(response.status===200){
            const entregas = await response.json();

            //no caso de ser necessário apagar a tabela
            const output = document.getElementById("output-entrega");
            while (output.rows.length > 1) {
                output.deleteRow(-1);
            }

            let myMap = new Map(Object.entries(entregas));
            console.log(myMap);
            
            for (let niveis = 0; niveis < myMap.size; niveis++){
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + myMap.get(''+ niveis).id + '</td>' +
                '<td>' + myMap.get(''+ niveis).idArmazem.value + '</td>' +
                '<td>' + myMap.get(''+ niveis).dataEntrega + '</td>' +
                '<td>' + myMap.get(''+ niveis).peso + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoCarregamento + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoDescarregamento + '</td>'
                ;
                output.appendChild(tr);
            }

        } else {
            window.alert("Ocorreu um erro ao encontrar as Entregas! Por favor tente novamente.");
        }
    }

    async function listarEntregaOrdenarData() {
        let path;
        if(opcao === 'todos') {
            path = '/dataAscendente'; //comentado no controller
        } else if(opcao === 'porIdArmazem') {
            path = '/porIdArmazemDataAscendente?idArmazem=' + idArmazemInput;
        } else if(opcao === 'porDatas') {
            path = '/porDatasDataAscendente?data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        } else {
            path = '/porIdArmazemEDatasDataAscendente?idArmazem=' + idArmazemInput + '&data1=' + dataInicialInput + '&data2=' + dataFinalInput;
        }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        const response = await fetch("https://localhost:5001/api/Entrega" + path, requestOptions)

        if(response.status===200){
            const entregas = await response.json();

            //no caso de ser necessário apagar a tabela
            const output = document.getElementById("output-entrega");
            while (output.rows.length > 1) {
                output.deleteRow(-1);
            }

            let myMap = new Map(Object.entries(entregas));
            console.log(myMap);
            
            for (let niveis = myMap.size-1; niveis > -1; niveis--){
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + myMap.get(''+ niveis).id + '</td>' +
                '<td>' + myMap.get(''+ niveis).idArmazem.value + '</td>' +
                '<td>' + myMap.get(''+ niveis).dataEntrega + '</td>' +
                '<td>' + myMap.get(''+ niveis).peso + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoCarregamento + '</td>' +
                '<td>' + myMap.get(''+ niveis).tempoDescarregamento + '</td>'
                ;
                output.appendChild(tr);
            }

        } else {
            window.alert("Ocorreu um erro ao encontrar as Entregas! Por favor tente novamente.");
        }
    }

    //os principais atributos a ordenar e filtrar são a data e o armazém de destino.
    //a data deve ser ordenada por ordem cronologica inversa
    //o armazem ordenado de forma ascendente.

    return (
        <main>
            <div className="main-listar-entrega">
                <div className="left-listar-entrega">
                    <table className='output-entrega' id="output-entrega">
                        <thead>
                            <tr>
                                <th className="id">Id de Entrega</th>
                                <th className="idArmazemEntrega" onClick={listarEntregaOrdenarIdArmazem}>Id de Armazém</th>
                                <th className="dataEntregaEntrega" onClick={listarEntregaOrdenarData}>Data de Entrega</th>
                                <th className="pesoEntrega">Peso</th>
                                <th className="tempoCarregamentoEntrega">Tempo de Carregamento</th>
                                <th className="tempoDescarregamentoEntrega">Tempo de Descarregamento</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right-listar-entrega">
                    <div className="card-listar-entrega">
                        <h1>LISTAR ENTREGA</h1>
                        <div className="textfield-listar-entrega">
                            <label>Id de Armazém</label>
                            <input id="idArmazemInput" type="text" className="inputEntrega" onChange={(e=>setIdArmazem(e.target.value))} readOnly/>
                        </div>
                        <div className="textfield-listar-entrega">
                            <label>Data Inicial</label>
                            <input id="dataInicialInput" type="text" className="inputEntrega" onChange={(e=>setDataInicial(e.target.value))} readOnly/>
                        </div>
                        <div className="textfield-listar-entrega">
                            <label>Data Final</label>
                            <input id="dataFinalInput" type="text" className="inputEntrega" onChange={(e=>setDataFinal(e.target.value))} readOnly/>
                        </div>
                        <div className="opcoes-entrega">
                            <label>Opção</label>
                            <select id="opcoes-entrega" onChange={atualizarOpcao}>
                                <option value="todos">Todos</option>
                                <option value="porIdArmazem">Por Id de Armazém</option>
                                <option value="porDatas">Por Datas</option>
                                <option value="porIdArmazemEDatas">Por Id de Armazém e Datas</option>
                            </select>
                        </div>
                        <button id="btn-listar-entrega" className="btn-listar-entrega" onClick={listarEntrega}>LISTAR</button>
                    </div>
                    <div className='criar-entrega-buttons'>
                        <button className="btn-home-entrega-listar" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                        <Link to="/armazem/menu">
                        <button className="btn-entrega-listar" ><img src={Home} alt="description" height ="70" width="70"/></button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListarEntrega;