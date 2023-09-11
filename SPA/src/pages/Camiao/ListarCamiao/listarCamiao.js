import './listarCamiao.css';
import Home from '../../../imagens/home.png';
import React, { useEffect } from 'react';
import {Link} from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestListarCamiao } from '../../../controllers/listarCamiaoController';

const ListarCamiao = () => {
    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeFrota");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    async function listarCamiao() {
        const camioes = await requestListarCamiao();
        
        //no caso de ser necessário apagar a tabela
        const output = document.getElementById("tabela-listar-camiao");
        while (output.rows.length > 1) {
            output.deleteRow(-1);
        }

        let myMap = new Map(Object.entries(camioes));

        for (let niveis = 0; niveis < myMap.size; niveis++) {
            let activeStatus = checkIfActiveOrNot(myMap.get('' +  niveis).ativoCamiao);
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + myMap.get(''+ niveis).nomeCamiao + '</td>' +
            '<td>' + myMap.get(''+ niveis).cargaTotalBaterias + '</td>' +
            '<td>' + myMap.get(''+ niveis).tara + '</td>' +
            '<td>' + myMap.get(''+ niveis).maximoCarga + '</td>' +
            '<td>' + myMap.get(''+ niveis).autonomia + '</td>' +
            '<td>' + myMap.get(''+ niveis).tempoCarregamento + '</td>' +
            '<td>' + myMap.get(''+ niveis).matriculaCamiao + '</td>' +
            '<td>' + activeStatus + '</td>';

            output.appendChild(tr);
        }
    }

    function checkIfActiveOrNot(option){
        return option === true ? "Sim" : "Não";
    }

    return (
        <main>
            <div className="main-listar-camiao">
                <div className="left-listar-camiao">
                    <table className="tabela-listar-camiao" id="tabela-listar-camiao">
                        <thead>
                            <tr>
                                <th className="nomeCamiaoTable">Nome</th>
                                <th className="cargaTotalBateriasTable">Carga Total das Baterias</th>
                                <th className="taraTable">Tara</th>
                                <th className="maximoCargaTable">Máximo de Carga</th>
                                <th className="autonomiaTable">Autonomia</th>
                                <th className="tempoCarregamentoTable">Tempo de Carregamento</th>
                                <th className="matriculaCamiaoTable">Matrícula</th>
                                <th className="ativoCamiaoTable">Ativo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right-listar-camiao">
                    <div className="card-listar-camiao">
                        <h1>LISTAR CAMIÃO</h1>
                        <div className="opcoes-camiao">
                            <label>Opção</label>
                            <select id="opcoes-camiao">
                                <option value="todos">Todos</option>
                            </select>
                        </div>
                        <button id="btn-listar-camiao" className="btn-listar-camiao" onClick={listarCamiao}>LISTAR</button>
                    </div>
                    <Link to="/menuGestorFrota">
                        <button className="btn-home"><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                    <button className="btn-logout-listar-camiao" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                </div>
            </div>
        </main>
    );
}

export default ListarCamiao;