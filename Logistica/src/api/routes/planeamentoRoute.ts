import { Router } from 'express';
import { Container } from 'typedi';
import IPlaneamentoController from '../../controllers/IControllers/IPlaneamentoController';

import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use('/planeamento', route);

    const ctrl = Container.get(config.controllers.planeamento.name) as IPlaneamentoController;

    route.get('/trajMaisRapida/:data/:camiao', (req, res, next) => { ctrl.obterPlaneamento(req, res, next); req.params.data; req.params.camiao; } );
    
    route.get('/heuristicaArmazem/:data/:camiao', (req, res, next) => { ctrl.obterPlaneamentoHeuristicaArmazem(req, res, next); req.params.data; req.params.camiao; } );
    
    route.get('/heuristicaEntrega/:data/:camiao', (req, res, next) => { ctrl.obterPlaneamentoHeuristicaEntrega(req, res, next); req.params.data; req.params.camiao; } );

    route.get('/heuristicaTempoMassa/:data/:camiao', (req, res, next) => { ctrl.obterPlaneamentoHeuristicaTempoMassa(req, res, next); req.params.data; req.params.camiao; } );
	
    route.get('/algoritmoSimulado/:data', (req, res, next) => { ctrl.obterPlaneamentoAlgoritmoSimulado(req, res, next); req.params.data; } );

    route.get('/viagensExistentes', (req, res, next) => ctrl.listarViagens(req, res, next));

    route.get('/algoritmoGenetico/:data', (req, res, next) => { ctrl.obterPlaneamentoAlgoritmoGenetico(req, res, next); req.params.data; } );
};

