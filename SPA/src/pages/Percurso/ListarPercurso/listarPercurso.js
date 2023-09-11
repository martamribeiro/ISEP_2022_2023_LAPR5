import './listarPercurso.css';
import React from "react";
import Home from '../../../imagens/home.png';
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { logout } from '../../../services/logoutService';
import Logout from '../../../imagens/logout.png';
import TablePagination from "@material-ui/core/TablePagination";
import { useNavigate } from 'react-router-dom';
import { requestDecodeToken } from '../../../services/checkSession';
import { requestListarPercurso } from '../../../controllers/listarPercursoController';

const ListarPercurso = () => {

    const [armazemPartida,setArmazemPartida]=useState('');
    const [armazemChegada,setArmazemChegada]=useState('');
    const [opcao, setOpcao]=useState('todos');
    const [pageOption, setPageOption] = React.useState(0);
    const [rowsPerPageOption, setRowsPerPageOption] = React.useState(5);
    const [numRows, setNumRows] = React.useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const getFuncaoUtilizador = async () => {
            const responseFuncaoUtilizador = await requestDecodeToken(localStorage.getItem('userToken'), "gestorDeLogistica");

            if(!responseFuncaoUtilizador){
                window.location.replace("/");
            }
        }

        getFuncaoUtilizador();
    });
    
    const handleChangePage = (event, newPage) => {
        setPageOption(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPageOption(event.target.value);
        setPageOption(0);
    };
    

    useEffect(() => {
        listar();
        //Runs on the first render
        //And any time any dependency value changes
      }, [pageOption, rowsPerPageOption]);


    const atualizarOpcao = (e) => {
        let opcaoSelecionada = e.target.value;
        setOpcao(opcaoSelecionada);
        let inputArmPartida = document.getElementById("armPartidaInput");
        let inputArmChegada = document.getElementById("armChegadaInput");
        limparDados(inputArmPartida, inputArmChegada);

        if(opcaoSelecionada === 'todos') {
            inputArmPartida.setAttribute('readonly', true);
            inputArmChegada.setAttribute('readonly', true);
        } else if(opcaoSelecionada === 'armPartida') {
            inputArmPartida.removeAttribute('readonly');
            inputArmChegada.setAttribute('readonly', true);
        } else if(opcaoSelecionada === 'armChegada') {
            inputArmPartida.setAttribute('readonly', true);
            inputArmChegada.removeAttribute('readonly');
        } else {
            inputArmPartida.removeAttribute('readonly');
            inputArmChegada.removeAttribute('readonly');
        }
        
        
    }

    function limparDados(inputArmPartida, inputArmChegada) {
        inputArmPartida.value = "";
        inputArmChegada.value = "";
    }

    function obterPath(opcao) {
        let path;

        if(opcao === 'todos') {
            path = '/todos';
        } else if(opcao === 'armPartida') {
            path = '/porArmazemPartida/' + armazemPartida;
        } else if(opcao === 'armChegada') {
            path = '/porArmazemChegada/' + armazemChegada
        } else if(opcao === 'armPartidaEChegada') {
            path = '/porArmPartidaEChegada/' + armazemPartida + '/' + armazemChegada;
        }

        return path;
    }

    
    async function listar() {
        let path = obterPath(opcao);

        const percursos = await requestListarPercurso(path);
        
        //no caso de ser necessário apagar a tabela
        const output = document.getElementById("output-percurso");
        while (output.rows.length > 1) {
            output.deleteRow(-1);
        }

        if(opcao === 'armPartidaEChegada') { //é necessário visto que é um GET que retorna SEMPRE um único percurso
            let row = output.insertRow(-1);
            inserirCell(row, percursos.armazemPartida);
            inserirCell(row, percursos.armazemChegada);
            inserirCell(row, percursos.distancia);
            inserirCell(row, percursos.duracao);
            inserirCell(row, percursos.energiaGasta);
            inserirCell(row, percursos.tempoExtra);

            setNumRows(1);
        } else {
            let myMap = new Map(Object.entries(percursos));
            
            Array.from(myMap).slice(pageOption * rowsPerPageOption, pageOption * rowsPerPageOption + rowsPerPageOption);
            setNumRows(myMap.size);


            for (let niveis = pageOption * rowsPerPageOption; niveis < pageOption * rowsPerPageOption + rowsPerPageOption; niveis++) {
                if(niveis < myMap.size) {
                    let row = output.insertRow(-1);
                    let armazemPartida = myMap.get('' + niveis).armazemPartida;
                    inserirCell(row, armazemPartida);
                    let armazemChegada = myMap.get('' + niveis).armazemChegada;
                    inserirCell(row, armazemChegada);
                    let distancia = myMap.get('' + niveis).distancia;
                    inserirCell(row, distancia);
                    let duracao = myMap.get('' + niveis).duracao;
                    inserirCell(row, duracao);
                    let energiaGasta = myMap.get('' + niveis).energiaGasta;
                    inserirCell(row, energiaGasta);
                    let tempoExtra = myMap.get('' + niveis).tempoExtra;
                    inserirCell(row, tempoExtra);
                }
            }
        }
    }

    function inserirCell(row, atributo) {
        let cell = row.insertCell(-1);
        cell.className = "output";
        cell.innerHTML = atributo;
    }
    

    return (
        <main>
            <div className="main-listar-percurso">
                <div className="left-listar-percurso">
                    <table className="output-percurso" id="output-percurso">
                        <thead>
                            <tr>
                                <th className="armPartidaTable">Armazém de Partida</th>
                                <th className="armChegadaTable">Armazém de Chegada</th>
                                <th className="distanciaTable">Distância</th>
                                <th className="duracaoTable">Duração</th>
                                <th className="energiaGastaTable">Energia Gasta</th>
                                <th className="tempoExtraTable">Tempo Extra</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                    </table>
                    <div className="tableFooter-percurso">
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={numRows}
                            rowsPerPage={rowsPerPageOption}
                            page={pageOption}
                            onPageChange={handleChangePage} 
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
                <div className="right-listar-percurso">
                    <div className="card-listar-percurso">
                        <h1>LISTAR PERCURSO</h1>
                        <div className="textfield-listar-percurso">
                            <label>Armazém de Partida</label>
                            <input id="armPartidaInput" type="text" className="inputPercurso" onChange={(e=>setArmazemPartida(e.target.value))} readOnly/>
                        </div>
                        <div className="textfield-listar-percurso">
                            <label>Armazém de Chegada</label>
                            <input id="armChegadaInput" type="text" className="inputPercurso" onChange={(e=>setArmazemChegada(e.target.value))} readOnly/> 
                        </div>
                        <div className="opcoes-percurso">
                            <label>Opção</label>
                            <select id="opcoes-perc" onChange={atualizarOpcao}>
                                <option value="todos">Todos</option>
                                <option value="armPartida">Por Armazém de Partida</option>
                                <option value="armChegada">Por Armazém de Chegada</option>
                                <option value="armPartidaEChegada">Por Armazém de Partida e Chegada</option>
                            </select>
                        </div>
                        <button id="btn-listar-perc" className="btn-listar-perc" onClick={listar}>LISTAR</button>
                    </div>
                    <div className='listar-percurso-buttons'>
                        <button className="btn-home-percurso-listar" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                        <Link to="/menuGestorLogistica">
                        <button className="btn-percurso-listar" ><img src={Home} alt="description" height ="70" width="70"/></button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ListarPercurso;