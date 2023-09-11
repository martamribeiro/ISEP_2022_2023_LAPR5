import './listarArmazem.css';
import Home from '../../../imagens/home.png';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import React from 'react';
import { useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { listArmazens, inibirArmazens } from '../../../controllers/listarArmazensController';

const ListarArmazem = () => {
    const [idArmazemInput,setArmazemID]=useState('');
    const [designacaoArmazemInput,setArmazemDesignacao]=useState('');
    const [opcao, setOpcao]=useState('todos');
    const [paginasTabela, setPaginasTabela] = useState([]);
    const [divisaoTabela, setDivisaoTabela] = useState([]);

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
        let opcaoSelecionada = document.getElementById("opcoes-armazem").value;
        setOpcao(opcaoSelecionada);
        let inputIDArmazem = document.getElementById("iDArmazemInput");
        let inputDesignacaoArmazem = document.getElementById("designacaoArmazemInput");
        if(opcaoSelecionada === 'todos') {
            //limparDados();
            inputIDArmazem.setAttribute('readonly', true);
            inputDesignacaoArmazem.setAttribute('readonly', true);
        } else if(opcaoSelecionada === 'porID') {
            //limparDados();
            inputIDArmazem.removeAttribute('readonly');
            inputDesignacaoArmazem.setAttribute('readonly', true);
        } else {
            //limparDados();
            inputDesignacaoArmazem.removeAttribute('readonly');
            inputIDArmazem.setAttribute('readonly', true);
        }
    }


    async function listarArmazem() {
        let path;
        if(opcao === 'todos') {
            path = '';
        } else if(opcao === 'porID') {
            path = '/' + idArmazemInput;
        } else if(opcao === 'porDesignacao') {
            path = '/porDesignacao?designacao=' + designacaoArmazemInput
        }
        
        
        const armazens = await listArmazens(path);


        if(armazens!=null) {

                //no caso de ser necessário apagar a tabela
                const output = document.getElementById("output-armazem");
                while (output.rows.length > 1) {
                    output.deleteRow(-1);
                }

                let myMap = new Map(Object.entries(armazens));
                console.log(myMap);
                
                var tr;
                var activo = '';
                if(opcao === 'todos') {
                    for (let niveis = 0; niveis < myMap.size; niveis++) {
                        
                        if(myMap.get(''+ niveis).active === true){
                            activo = "Sim";
                        }else {
                            activo = "Não";
                        }


                        tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + myMap.get(''+ niveis).id + '</td>' +
                        '<td>' + myMap.get(''+ niveis).designcacao + '</td>' +
                        '<td>' + myMap.get(''+ niveis).morada.rua + '</td>' +
                        '<td>' + myMap.get(''+ niveis).morada.numeroPorta + '</td>' +
                        '<td>' + myMap.get(''+ niveis).morada.codigoPostal + '</td>' +
                        '<td>' + myMap.get(''+ niveis).morada.localidade + '</td>' +
                        '<td>' + myMap.get(''+ niveis).morada.pais + '</td>' +
                        '<td>' + myMap.get(''+ niveis).coordenadas.latitude + '</td>' +
                        '<td>' + myMap.get(''+ niveis).coordenadas.longitude + '</td>' +
                        '<td>' + myMap.get(''+ niveis).coordenadas.altitude + '</td>' +
                        '<td>' + activo + '</td>'
                        ;

                        output.appendChild(tr);
                    }  
                } else {
                        if(myMap.get('active') === true){
                            activo = 'Sim';
                        }else {
                            activo = 'Não';
                        }

                        tr = document.createElement('tr');
                        tr.innerHTML = '<td>' + myMap.get('id') + '</td>' +
                        '<td>' + myMap.get('designcacao') + '</td>' +
                        '<td>' + myMap.get('morada').rua + '</td>' +
                        '<td>' + myMap.get('morada').numeroPorta + '</td>' +
                        '<td>' + myMap.get('morada').codigoPostal + '</td>' +
                        '<td>' + myMap.get('morada').localidade + '</td>' +
                        '<td>' + myMap.get('morada').pais + '</td>' +
                        '<td>' + myMap.get('coordenadas').latitude + '</td>' +
                        '<td>' + myMap.get('coordenadas').longitude + '</td>' +
                        '<td>' + myMap.get('coordenadas').altitude + '</td>' +
                        '<td>' + activo + '</td>'
                        ;

                        output.appendChild(tr);
                }
        }else{
            window.alert("Ocorreu um erro ao encontrar o Armazém! Por favor tente novamente.");
        }
        
    }

    async function inibirArmazem(){
        let path, tr;
        let activo = '';
        if(opcao === 'porID') {
            path = '/' + idArmazemInput;

            const armazens = await inibirArmazens(idArmazemInput);


            if(armazens!=null) {

                //no caso de ser necessário apagar a tabela
                const output = document.getElementById("output-armazem");
                while (output.rows.length > 1) {
                    output.deleteRow(-1);
                }

                let myMap = new Map(Object.entries(armazens));
                console.log(myMap);

                if(myMap.get('active') === true){
                    activo = 'Sim';
                }else {
                    activo = 'Não';
                }

                tr = document.createElement('tr');
                tr.innerHTML = '<td>' + myMap.get('id') + '</td>' +
                '<td>' + myMap.get('designcacao') + '</td>' +
                '<td>' + myMap.get('morada').rua + '</td>' +
                '<td>' + myMap.get('morada').numeroPorta + '</td>' +
                '<td>' + myMap.get('morada').codigoPostal + '</td>' +
                '<td>' + myMap.get('morada').localidade + '</td>' +
                '<td>' + myMap.get('morada').pais + '</td>' +
                '<td>' + myMap.get('coordenadas').latitude + '</td>' +
                '<td>' + myMap.get('coordenadas').longitude + '</td>' +
                '<td>' + myMap.get('coordenadas').altitude + '</td>' +
                '<td>' + activo + '</td>'
                ;

                output.appendChild(tr);

            }        
    

        } 
    }

    async function numPaginas (armazens, armazensPorPagina) {
        const numPags = [];
        const num = Math.ceil(armazens.length / armazensPorPagina);
        let i = 1;
        for (let i = 1; i <= num; i++) {
          numPags.push(i);
        }
        return numPags;
    };

    const sliceData = (data, page, rowsPerPage) => {
        return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    };
      

    return (
        <main>
            <div className="main-listar-armazem">
                <div className="left-listar-armazem">
                    <table className="output-armazem" id="output-armazem">
                        <thead>
                            <tr>
                                <th className="idArmazem">ID do Armazem</th>
                                <th className="designacaoArmazem">Designação</th>
                                <th className="ruaArmazem">Rua</th>
                                <th className="numeroPortaArmazem">Numero da Porta</th>
                                <th className="codigoPostalArmazem">Código-Postal</th>
                                <th className="localidadeArmazem">Localidade</th>
                                <th className="paisArmazem">Pais</th>
                                <th className="latitudeArmazem">Latitude</th>
                                <th className="longitudeArmazem">Longitude</th>
                                <th className="altitudeArmazem">Altitude</th>
                                <th className="activeArmazem">Ativo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>

                        <tfoot>

                        </tfoot>
                    </table>
                </div>
                <div className="right-listar-armazem">
                    <div className="card-listar-armazem">
                        <h1>LISTAR ARMAZEM</h1>
                        <div className="textfield-listar-armazem">
                            <label>ID do Armazém</label>
                            <input id="iDArmazemInput" type="text" className="inputArmazem" onChange={(e=>setArmazemID(e.target.value))} readOnly/>
                        </div>
                        <div className="textfield-listar-armazem">
                            <label>Designacao do Armazém</label>
                            <input id="designacaoArmazemInput" type="text" className="inputArmazem" onChange={(e=>setArmazemDesignacao(e.target.value))} readOnly/> 
                        </div>
                        <div className="opcoes-armazem">
                            <label>Opção</label>
                            <select id="opcoes-armazem" onChange={atualizarOpcao}>
                                <option value="todos">Todos</option>
                                <option value="porID">ID</option>
                                <option value="porDesignacao">Designação</option>
                            </select>
                        </div>
                        <button id="btn-listar-armazem" className="btn-listar-armazem" onClick={listarArmazem}>LISTAR</button>
                        <button id="btn-inibir-armazem" className="btn-inibir-armazem" onClick={inibirArmazem}>inibir</button>
                    </div>
                    <div className='criar-armazem-buttons'>
                        <button className="btn-home-armazem-listar" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                        <Link to="/armazem/menu">
                        <button className="btn-armazem-listar" ><img src={Home} alt="description" height ="70" width="70"/></button>
                        </Link></div>
                    </div>
            </div>
        </main>
    );
}

export default ListarArmazem;
