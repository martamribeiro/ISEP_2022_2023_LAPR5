import './listarViagens.css';
import Home from '../../imagens/home.png';
import React from 'react';
import { useState, useEffect } from 'react';
import {Link } from "react-router-dom";
import TablePagination from "@material-ui/core/TablePagination";
import { logout } from '../../services/logoutService';
import Logout from '../../imagens/logout.png';
import { useNavigate } from 'react-router-dom';

let page = 0;
let rowsPerPage = 5;


const ListarViagens = () => {
    const [numRows, setNumRows] = useState(0);
    const [pageOption, setPage] = useState(0);
    const [rowsPerPageOption, setRowsPerPage] = useState(5);
    const navigate = useNavigate();
    

    const handleChangePage = (event, newPage) => {
        page = newPage;
        setPage(newPage);
        console.log(rowsPerPage);
        listar();
    };

    

    const handleChangeRowsPerPage = event => {
        rowsPerPage = event.target.value;
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
        listar();
    };


    async function listar() {
        

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        const response = await fetch("http://localhost:3000/api/planeamento/viagensExistentes", requestOptions)


        if(response.status===200){
            const percursos = await response.json();
            

            //no caso de ser necessário apagar a tabela
            const output = document.getElementById("output-viagens");
            while (output.rows.length > 1) {
                output.deleteRow(-1);
            }

            
            let myMap = new Map(Object.entries(percursos));
            
            let auxArray = Array.from(myMap).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
            let newMap = new Map(auxArray);
            

            setNumRows(myMap.size);
   
            
            let tr;
            for (let niveis = page * rowsPerPage; niveis < page * rowsPerPage + rowsPerPage; niveis++){
                if(niveis < myMap.size){
                    tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + newMap.get(''+ niveis).camiao + '</td>' +
                    '<td>' + newMap.get(''+ niveis).armazens + '</td>' +
                    '<td>' + newMap.get(''+ niveis).tempoViagem + '</td>' ;
                    output.appendChild(tr);
                }
            }

        } else {
            window.alert("Ocorreu um erro ao encontrar a Entrega! Por favor tente novamente.");
        }

        
    }

    return (
        <main>
            <div className="main-listar-viagens">
                <div className="left-listar-viagens">
                    <table className='output-viagens' id="output-viagens">
                        <thead>
                            <tr>
                                <th className="tempo-viagens">Tempo</th>
                                <th className="route-viagens">Percurso</th>
                                <th className='camiao-viagens'>Camião</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            </tr>
                        </tbody>
                        
                            
                        
                            
                        
                    </table>
                    <div className='viagens-table-foot' >
                      <TablePagination
                            rowsPerPageOptions={[0, 5, 10, 25]}
                            component="div"
                            count={numRows}
                            rowsPerPage={rowsPerPageOption}
                            page={pageOption}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />  
                    </div>
                    
                </div>
                <div className="right-listar-viagens">
                    <div className="card-listar-viagens">
                        <h1>Viagens</h1>
                        <button id="btn-listar-viagens" className="btn-listar-viagens" onClick={listar}>LISTAR</button>
                    </div>
                    <button className="btn-home" onClick={logout}><img src={Logout} alt="description" height ="70" width="70"/></button>
                    <Link to="/menuGestorLogistica">
                    <button className="btn-viagens-listar" ><img src={Home} alt="description" height ="70" width="70"/></button>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default ListarViagens;