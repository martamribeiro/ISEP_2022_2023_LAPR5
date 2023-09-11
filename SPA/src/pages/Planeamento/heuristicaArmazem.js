import './heuristicaArmazem.css';
import Home from '../../imagens/home.png';
import React from 'react';
import { useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import { logout } from '../../services/logoutService';
import Logout from '../../imagens/logout.png';
import { requestDecodeToken } from '../../services/checkSession';

const HeuristicaArmazem = () => {

    const [data,setData]=useState('');
    const [idCamiao,setIdCamiao]=useState('');
    const [opcao, setOpcao]=useState('Heurística Armazém Mais Próximo');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeLogistica");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    function atualizarOpcao() {
        let opcaoSelecionada = document.getElementById("opcoes-planeamento").value;
        setOpcao(opcaoSelecionada);
        let inputIdCamiao = document.getElementById("inputIdCamiao");
        let inputData = document.getElementById("inputData");
        if(opcaoSelecionada === 'Algoritmo Simulado' || opcaoSelecionada === 'Algoritmo Genético'){
            inputIdCamiao.setAttribute('readonly', true);
            inputData.removeAttribute('readonly');
        } else {
            inputIdCamiao.removeAttribute('readonly');
            inputData.removeAttribute('readonly');
        }
    }

    async function listar() {
        let path;
        if(opcao === 'Heurística Armazém Mais Próximo') {
            path = 'heuristicaArmazem' + "/" + data + "/" + idCamiao;
        } else if(opcao === 'Heurística da Maior Massa') {
            path = 'heuristicaEntrega' + "/" + data + "/" + idCamiao;
        } else if(opcao === 'Heurística Melhor Relação entre Tempo e Massa') {
            path = 'heuristicaTempoMassa' + "/" + data + "/" + idCamiao;
        } else if(opcao === 'Viagem Mais Rápida'){
            path = 'trajMaisRapida' + "/" + data + "/" + idCamiao;
        } else if(opcao === 'Algoritmo Simulado'){
            path = 'algoritmoSimulado' + "/" + data; //preencher e confirmar
        } else if(opcao === 'Algoritmo Genético'){
            path = 'algoritmoGenetico' + "/" + data; //preencher e confirmar
        }

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        const response = await fetch("http://localhost:3000/api/planeamento/" + path, requestOptions)


        if(response.status===200){
            const percursos = await response.json();
            let opcaoSelecionada = document.getElementById("opcoes-planeamento").value;

            //no caso de ser necessário apagar a tabela
            const output = document.getElementById("output");
            while (output.rows.length > 1) {
                output.deleteRow(-1);
            }

            let myMap = new Map(Object.entries(percursos));
            console.log(myMap);
   
            if(opcaoSelecionada === 'Algoritmo Simulado' || opcaoSelecionada === 'Algoritmo Genético'){

                for (let niveis = 0; niveis < myMap.size; niveis++){
                    let truck = myMap.get(niveis.toString());
                    let row = output.insertRow(-1);
                    let camiao = truck.camiao;
                    console.log(camiao);
                    inserirCell(row, camiao);
                    let tempo = truck.tempoViagem;
                    console.log(tempo);
                    inserirCell(row, tempo);
                    const route = truck.armazens;
                    console.log(route);
                    inserirCell(row, route);
                }

            } else {

                let row = output.insertRow(-1);
                let camiao = percursos['camiao'];
                inserirCell(row, camiao);
                let tempo = percursos['tempoViagem'];
                inserirCell(row, tempo);
                const route = percursos['armazens'];
                inserirCell(row, route);

            }

        } else {
            window.alert("Ocorreu um erro ao encontrar a Entrega! Por favor tente novamente.");
        }

        
    }

    function inserirCell(row, atributo) {
        let cell = row.insertCell(-1);
        cell.className = "output";
        cell.innerHTML = atributo;
    }

    return (
        <main>
            <div className="main-heuristica-armazem">
                <div className="left-heuristica-armazem">
                    <table className='output-planeamento' id="output">
                        <thead>
                            <tr>
                                <th className="camiao">Camião</th>
                                <th className="tempo">Tempo (min)</th>
                                <th className="route">Percurso (IDs de Armazéns)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right-heuristica-armazem">
                    <div className="card-heuristica-armazem">
                        <h1>Planeamento de Rotas</h1>
                        <div className="textfield-heuristica-armazem">
                            <label>Data</label>
                            <input id="inputData" type="text" className="inputPlaneamento" onChange={(e=>setData(e.target.value))}/>
                        </div>
                        <div className="textfield-heuristica-armazem">
                            <label>Id de Camião</label>
                            <input id="inputIdCamiao" type="text" className="inputPlaneamento" onChange={(e=>setIdCamiao(e.target.value))}/>
                        </div>
                        <div className="opcoes-planeamento">
                            <label>Opção</label>
                            <select id="opcoes-planeamento" onChange={atualizarOpcao}>
                                <option value="Heurística Armazém Mais Próximo">Heurística Armazém Mais Próximo</option>
                                <option value="Heurística da Maior Massa">Heurística da Maior Massa</option>
                                <option value="Heurística Melhor Relação entre Tempo e Massa">Heurística Melhor Relação entre Tempo e Massa</option>
                                <option value="Viagem Mais Rápida">Viagem Mais Rápida</option>
                                <option value="Algoritmo Simulado">Algoritmo Simulado</option>
                                <option value="Algoritmo Genético">Algoritmo Genético</option>
                            </select>
                        </div>
                        <button id="btn-heuristica-armazem" className="btn-heuristica-armazem" onClick={listar}>LISTAR</button>
                    </div>
                    <button className="btn-home" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                    <Link to="/menuGestorLogistica">
                    <button className="btn-heuristica-obter" ><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default HeuristicaArmazem;