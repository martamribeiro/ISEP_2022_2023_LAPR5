import './criarArmazem.css';
import React, {useState, useEffect} from "react";
import Home from '../../../imagens/home.png';
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import {Link } from "react-router-dom";
import { requestDecodeToken } from '../../../services/checkSession';
import { criarArmazens } from '../../../controllers/criarArmazensController';

const CriarArmazem = () => {
    const [idArmazemInput,setArmazemId]=useState('');
    const [designacaoArmazemInput,setArmazemDesignacao]=useState('');
    const [ruaArmazemInput,setArmazemRua]=useState('');
    const [numeroPortaArmazemInput,setArmazemNumeroPorta]=useState('');
    const [codigoPostalArmazemInput,setArmazemCodigoPostal]=useState('');
    const [localidadeArmazemInput,setArmazemLocalidade]=useState('');
    const [paisArmazemInput,setArmazemPais]=useState('');
    const [latitudeArmazemInput,setArmazemLatitude]=useState('');
    const [longitudeArmazemInput,setArmazemLongitude]=useState('');
    const [altitudeArmazemInput,setArmazemAltitude]=useState('');

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeArmazem");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });

      function onCreateArmazem(){

        const armazemInfo= JSON.stringify({
            id: idArmazemInput,
            designcacao: designacaoArmazemInput,
            morada:{
                rua: ruaArmazemInput,
                numeroPorta: numeroPortaArmazemInput,
                codigoPostal: codigoPostalArmazemInput,
                localidade: localidadeArmazemInput,
                pais: paisArmazemInput
            },
            coordenadas: {
                latitude: latitudeArmazemInput,
                longitude: longitudeArmazemInput,
                altitude: altitudeArmazemInput
            }
        });

        
          const response = criarArmazens(armazemInfo);
          if(response==null) {
            window.alert("Os dados introduzidos não possibilitam a criação de um Armazém! Introduza os dados novamente. \n" + 
            "Siga os seguintes formatos:\n" +
            "\t-ID: 3 caracteres alfa-numéricos;\n" +
            "\t-Designação: máximo de 50 caracteres;\n" +
            "\t-Rua: nome da rua;\n" +
            "\t-Número da Porta: número inteiro;\n"+
            "\t-Código-Postal: formato português(ex:7854-896);\n"+
            "\t-Localidade: localidade do Armazém;\n" +
            "\t-País: país do Armazém;\n"+
            "\t-Latitude: número decimal entre -90.00 e 90.00;\n"+
            "\t-Longitude: número decimal entre -180 e 180;\n" +
            "\t-Latitude: número decimal.");
          } else{
            window.alert("Armazém criado com sucesso!");
          }
      }

  
        

        return (
        <main>
            <div className="main-armazem">   
                <div className="card-armazem">
                    <h1>CRIAR ARMAZEM</h1>
                    <div className="textfield-armazem">
                        <label>ID de Armazém</label>
                        <input id="inputArmazem" type="text" className="inputArmazem" maxLength={3} onChange={(e=>setArmazemId(e.target.value))} required />
                    </div>
                    <div className="textfield-armazem">
                        <label>Designação</label>
                        <input id="inputDesignacao" type="text" className="inputArmazem" maxLength={50} onChange={(e=>setArmazemDesignacao(e.target.value))} required/>
                    </div>  
                    <div className="textfield-armazem">
                        <label>Rua</label>
                        <input id="inputRua" type="text" className="inputArmazem" onChange={(e=>setArmazemRua(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Numero da Porta</label>
                        <input id="inputPorta" type="number" className="inputArmazem" min={0} onChange={(e=>setArmazemNumeroPorta(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Código Postal</label>
                        <input id="inputPostal" type="text" className="inputArmazem" pattern='[0-9]{4}-[0-9]{3}' onChange={(e=>setArmazemCodigoPostal(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Localidade</label>
                        <input id="inputLocalidade" type="text" className="inputArmazem" onChange={(e=>setArmazemLocalidade(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>País</label>
                        <input id="inputPais" type="text" className="inputArmazem" onChange={(e=>setArmazemPais(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Latitude</label>
                        <input id="inputLatitude" type="number" step="0.01" className="inputArmazem" min={-90} max={90} onChange={(e=>setArmazemLatitude(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Longitude</label>
                        <input id="inputLongitude" type="number" step="0.01" className="inputArmazem" min={-180} max={180} onChange={(e=>setArmazemLongitude(e.target.value))}/>
                    </div>
                    <div className="textfield-armazem">
                        <label>Altitude</label>
                        <input id="inputAltitude" type="number" step="0.01" className="inputArmazem" min={0} onChange={(e=>setArmazemAltitude(e.target.value))}/>
                    </div>
                    <button id="btn-criar-armazem" className="btn-criar-armazem" onClick={onCreateArmazem}>Criar</button>
                </div>
                <div>
                    <button className="btn-home-armazem" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                    <Link to="/armazem/menu">
                    <button className="btn-armazem" ><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                </div>
            </div>
        </main> 
        );       
    
}

export default CriarArmazem;

