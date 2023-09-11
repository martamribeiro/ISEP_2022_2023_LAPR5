import './criarCamiao.css';
import React, {useEffect} from "react";
import Home from '../../../imagens/home.png';
import { useState } from 'react';
import {Link} from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestCriarCamiao } from '../../../controllers/criarCamiaoController';

const CriarCamiao = () => {
    const [nomeCamiao, setNomeCamiao]=useState('');
    const [cargaTotalBaterias, setCargaTotalBaterias]=useState('');
    const [tara, setTara]=useState('');
    const [maximoCarga, setMaximoCarga]=useState('');
    const [autonomia, setAutonomia]=useState('');
    const [tempoCarregamento, setTempoCarregamento]=useState('');
    const [matriculaCamiao, setMatriculaCamiao]=useState('');
    const [ativoCamiao, setAtivoCamiao]=useState('true');
    const [opcao, setOpcao]=useState('sim');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeFrota");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

    const changeActive = (e) => {
        let opcaoSelecionada = e.target.value;
        setOpcao(opcaoSelecionada);

        if(opcaoSelecionada === 'sim'){
            setAtivoCamiao('true');
        }else if(opcaoSelecionada === 'nao'){
            setAtivoCamiao('false');
        }
    }

    async function criarCamiao(){
        await requestCriarCamiao(nomeCamiao, cargaTotalBaterias, tara, maximoCarga, autonomia, tempoCarregamento, matriculaCamiao, ativoCamiao);
    }
    
        
    return(     
        <main>
            <div className="main-camiao">   
                <div className="card-camiao">
                    <h1>CRIAR CAMIÃO</h1>
                    <div className="textfield-camiao">
                        <label>Nome do Camião</label>
                        <input id="inputNome" type="text" className="inputCamiao" onChange={(e=>setNomeCamiao(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                        <label>Carga Total das Baterias</label>
                        <input id="inputCargaTotalBaterias" type="number" className="inputCamiao" onChange={(e=>setCargaTotalBaterias(e.target.value))}/>
                    </div>  
                    <div className="textfield-camiao">
                        <label>Tara</label>
                        <input id="inputTara" type="number" className="inputCamiao" onChange={(e=>setTara(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                         <label>Máximo de Carga</label>
                         <input id="inputMaxCarga" type="number" className="inputCamiao" onChange={(e=>setMaximoCarga(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                        <label>Autonomia</label>
                        <input id="inputAutonomia" type="number" className="inputCamiao" onChange={(e=>setAutonomia(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                        <label>Tempo de Carregamento</label>
                        <input id="inputTempoCarregamento" type="number" className="inputCamiao" onChange={(e=>setTempoCarregamento(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                        <label>Matrícula do Camião</label>
                        <input id="inputMatricula" type="text" className="inputCamiao" onChange={(e=>setMatriculaCamiao(e.target.value))}/>
                    </div>
                    <div className="textfield-camiao">
                        <label>Ativo</label>
                        <select id="opcoes-camiao-ativo" defaultValue={'sim'} onChange={changeActive}>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                        </select>
                    </div>
                    <button id="btn-criar-camiao" className="btn-criar" onClick={criarCamiao}>Criar</button>
                </div>
                <Link to="/menuGestorFrota">
                    <button className="btn-home"><img src={Home} alt="description" height ="70" width="70"/></button>
                </Link>
                <button className="btn-logout-criar-camiao" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
            </div>
        </main>
    );
}

export default CriarCamiao;