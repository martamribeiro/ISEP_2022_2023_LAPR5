import './inibirDesinibirCamiao.css';
import Home from '../../../imagens/home.png';
import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestListarCamioesPorEstado, requestGetCamiaoPorNome, requestEditarCamiaoEstadoDoCamiao } from '../../../controllers/inibirCamiaoController';

const InibirDesinibirCamiao = () => {
    const[opcao,setOpcao] = useState('ativo');
    const[nomeCamiao,setNomeCamiao] = useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeFrota");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    const changeOption = (e) => {
        let opcaoSelecionada = e.target.value;
        setOpcao(opcaoSelecionada);
    }

    async function listarCamioesPorEstado() {
        let path;
        if(opcao === 'ativo'){
            path = '/porCamioesAtivos/' + 'ativo';
        }else if(opcao === 'desativo'){
            path = '/porCamioesDesativos/' + 'desativo';
        }

        const camioes = await requestListarCamioesPorEstado(path);
        
        const output = document.getElementById("tabela-inibir-camiao");
        while (output.rows.length > 1) {
            output.deleteRow(-1);
        }

        let myMap = new Map(Object.entries(camioes));

        for (let niveis = 0; niveis < myMap.size; niveis++) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + myMap.get(''+ niveis).nomeCamiao + '</td>' +
            '<td>' + myMap.get(''+ niveis).matriculaCamiao + '</td>';

            output.appendChild(tr);
        }
    }

    async function editarEstadoDoCamiao(){
        let changedAtivoCamiao;
        let path = '/porNomeCamiao/' + nomeCamiao;

        const camiao = await requestGetCamiaoPorNome(path);

        let autonomia = camiao.autonomia;
        let ativoCamiao = camiao.ativoCamiao;
        let cargaTotalBaterias = camiao.cargaTotalBaterias;
        let matriculaCamiao = camiao.matriculaCamiao;
        let maximoCarga = camiao.maximoCarga;
        let tara = camiao.tara;
        let tempoCarregamento = camiao.tempoCarregamento;

        if(ativoCamiao === true){
            changedAtivoCamiao = false;
        }else if(ativoCamiao === false){
            changedAtivoCamiao = true;
        }

        await requestEditarCamiaoEstadoDoCamiao(nomeCamiao, cargaTotalBaterias, tara, maximoCarga, autonomia, tempoCarregamento, matriculaCamiao, changedAtivoCamiao);

        window.setTimeout( function() {
            window.location.reload();
        }, 1000);
    }

    return(
        <main>
            <div className="main-inibir-camiao">   
                <div className="left-inibir-camiao">
                    <table className="tabela-inibir-camiao" id="tabela-inibir-camiao">
                        <thead>
                            <tr>
                                <th className="nomeCamiaoInibTable">Nome</th>
                                <th className="matriculaCamiaoInibTable">Matrícula</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="right-inibir-camiao">
                    <div className="card-inibir-camiao">    
                        <h1>INIBIR/DESINIBIR CAMIÃO</h1>
                        <div className="textfield-camiao">
                            <label>Listar Camiões</label>
                            <select id="opcoes-camiao-ativo" className="opcoes-camiao-ativo" defaultValue={'sim'} onChange={changeOption}>
                                <option value="ativo">Ativos</option>
                                <option value="desativo">Desativos</option>
                            </select>
                        </div>
                        <button id="btn-listar-camiao-por-estado" className="btn-listar" onClick={listarCamioesPorEstado}>Listar</button>
                        <div className="textfield-camiao">
                            <label>Nome do Camião a Inibir/Desinibir</label>
                            <input id="inputNome" type="text" className="inputNomeCamiao" onChange={(e=>setNomeCamiao(e.target.value))}/>
                        </div>
                        <button id="btn-editar-estado-camiao" className="btn-editar" onClick={editarEstadoDoCamiao}>Editar</button>
                    </div>
                    <Link to="/menuGestorFrota">
                        <button className="btn-home"><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                    <button className="btn-logout-inibir-camiao" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                </div>
            </div>
        </main>
    );
}

export default InibirDesinibirCamiao;