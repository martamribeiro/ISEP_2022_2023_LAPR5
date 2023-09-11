import './criarPercurso.css';
import React from "react";
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import { requestDecodeToken } from '../../../services/checkSession';
import Home from '../../../imagens/home.png';
import { requestCriarPercurso } from '../../../controllers/criarPercursoController';

const CriarPercurso = () => {

    const [armazemPartida,setArmazemPartida]=useState('');
    const [armazemChegada,setArmazemChegada]=useState('');
    const [distancia,setDistancia]=useState('');
    const [duracao,setDuracao]=useState('');
    const [energiaGasta,setEnergiaGasta]=useState('');
    const [tempoExtra,setTempoExtra]=useState('');

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeLogistica");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });
    

    function criar() {
        const errors = {};
        let dadosValidos = true;

        if(armazemPartida.length === 0 || armazemChegada.length === 0 ||
            distancia.length === 0 || duracao.length === 0 || energiaGasta.length === 0 ||  tempoExtra.length === 0) {
                errors.camposObrigatorios = "Todos os campos são obrigatórios!"
                dadosValidos = false;
        }
        if(distancia < 0 || duracao < 0 || energiaGasta < 0 || tempoExtra < 0) {
            errors.valoresNumericos = "Distância, Duração, Energia e Tempo Extra não podem ser negativos!"
            dadosValidos = false;
        }
        setFormErrors(errors);

        if(dadosValidos) {
            pedidoAPILogistica();
        } 
    };


    async function pedidoAPILogistica () {
            await requestCriarPercurso(armazemPartida, armazemChegada, distancia, duracao, energiaGasta, tempoExtra);
    }

    return (
        <main>
            <div className="main-percurso">   
                <div className="card-percurso">
                    <h1>CRIAR PERCURSO</h1>
                    <div className="textfield-percurso">
                        <label>Armazém de Partida</label>
                        <input type="text" id="armPartida" className="inputPercurso" onChange={(e=>setArmazemPartida(e.target.value))}/>
                    </div>
                    <div className="textfield-percurso">
                        <label>Armazém de Chegada</label>
                        <input type="text" id="armChegada" className="inputPercurso" onChange={(e=>setArmazemChegada(e.target.value))}/> 
                    </div>
                    <div className="textfield-percurso">
                        <label>Distância</label>
                        <input type="number" id="distancia" className="inputPercurso" onChange={(e=>setDistancia(e.target.value))}/>
                    </div>
                    <div className="textfield-percurso">
                        <label>Duração</label>
                        <input type="number" id="duracao" className="inputPercurso" onChange={(e=>setDuracao(e.target.value))}/>
                    </div>
                    <div className="textfield-percurso">
                        <label>Energia Gasta</label>
                        <input type="number" id="energiaGasta" className="inputPercurso" onChange={(e=>setEnergiaGasta(e.target.value))}/>
                    </div>
                    <div className="textfield-percurso">
                        <label>Tempo Extra</label>
                        <input type="number" id="tempoExtra" className="inputPercurso" onChange={(e=>setTempoExtra(e.target.value))}/>
                    </div>
                    <div className="errors">
                        <label>{formErrors.camposObrigatorios}</label>
                        <label>{formErrors.valoresNumericos}</label>
                    </div>                    
                    <button id="btn-criar" className="btn-criar" onClick={criar}>Criar</button>
                </div>
                <div className="criar-percurso-buttons">
                    <button className="btn-home-percurso-criar"onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                    <Link to="/menuGestorLogistica">
                        <button className="btn-percurso-criar"><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default CriarPercurso;