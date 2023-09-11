import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPercursoController from '../../controllers/IControllers/IPercursoController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/percursos', route);
  
    const ctrl = Container.get(config.controllers.percurso.name) as IPercursoController;
  
    route.post('',
      celebrate({
        body: Joi.object({
          armazemPartida: Joi.string().required(),
          armazemChegada: Joi.string().required(),
          distancia: Joi.number().required().min(0),
          duracao: Joi.number().required().min(0),
          energiaGasta: Joi.number().required().min(0),
          tempoExtra: Joi.number().required().min(0)
        })
      }),
      (req, res, next) => ctrl.criarPercurso(req, res, next) );
    
    route.put('',
    celebrate({
      body: Joi.object({
        armazemPartida: Joi.number().required(),
        armazemChegada: Joi.number().required(),
        distancia: Joi.number().required().min(0),
        duracao: Joi.number().required().min(0),
        energiaGasta: Joi.number().required().min(0),
        tempoExtra: Joi.number().required().min(0)
      }),
    }),
    (req, res, next) => ctrl.editarPercurso(req, res, next) );

    route.get('/todos', (req, res, next) => ctrl.listarPercursos(req, res, next));

    route.get('/porArmazemPartida/:armazemPartida', (req, res, next) => { ctrl.listarPercursosPorArmazemPartida(req, res, next); req.params.armazemPartida; } );
    
    route.get('/porArmazemChegada/:armazemChegada', (req, res, next) => { ctrl.listarPercursosPorArmazemChegada(req, res, next); req.params.armazemChegada; } );
  
    route.get('/porArmPartidaEChegada/:armazemPartida/:armazemChegada', (req, res, next) => { ctrl.listarPercursosPorArmPartidaEChegada(req, res, next); req.params.armazemPartida; req.params.armazemChegada } );
  };