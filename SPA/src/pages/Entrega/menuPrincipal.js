import './menuPrincipal.css';
import React from "react";
import Home from '../../imagens/home.png';
import {Link } from "react-router-dom";

export default class MenuPrincipal extends React.Component{
    render() {
        return (
        <main>
            <div className="main-menu-entrega">   
                <div className="card-menu-entrega">
                    <h1>MENU ENTREGA</h1>
                    <Link to="/entrega/criar">
                        <button className="btn-menu-criar-entrega" >Criar Entrega</button>
                    </Link>
                    <Link to="/entrega/listar">
                        <button className="btn-menu-listar-entrega" >Listar Entrega</button>
                    </Link>
                </div>
                <Link to="/">
                <button className="btn-home" ><img src={Home} alt="description" height ="70" width="70"/></button>
                </Link>
            </div>
        </main> 
        );       
    }
}