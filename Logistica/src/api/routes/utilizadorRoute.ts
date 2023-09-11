import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IUtilizadorController from '../../controllers/IControllers/IUtilizadorController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/utilizadores', route);

    const ctrl = Container.get(config.controllers.utilizador.name) as IUtilizadorController;

    route.post('',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                email: Joi.string().required().regex(new RegExp("^([a-zA-Z0-9]+)(@|(&#x40;))[a-zA-Z]+.[a-zA-Z]{2,4}$")).required(),
                primeiroNome: Joi.string().required(),
                ultimoNome: Joi.string().required(),
                password: Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
                numeroTelefone: Joi.number().integer().min(100000000).max(999999999).required(),
                funcaoUtilizador: Joi.string().required()
            })
        }),
        (req, res, next) => ctrl.criarUtilizador(req, res, next));

    route.put('',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                email: Joi.string().required().regex(new RegExp("^([a-zA-Z0-9]+)(@|(&#x40;))[a-zA-Z]+.[a-zA-Z]{2,4}$")).required(),
                primeiroNome: Joi.string().required(),
                ultimoNome: Joi.string().required(),
                password: Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
                numeroTelefone: Joi.number().integer().min(100000000).max(999999999).required(),
                funcaoUtilizador: Joi.string().required()
            })
        }),
        (req, res, next) => ctrl.criarUtilizador(req, res, next));
    
    route.get('/utilizadoresExistentes', (req, res, next) => ctrl.listarUtilizadores(req, res, next));

    route.get('/porUsername/:username', (req, res, next) => {ctrl.getUtilizadorPorUsername(req, res, next); req.params.username; });

    route.get('/porEmail/:email', (req, res, next) => {ctrl.getUtilizadorPorEmail(req, res, next); req.params.email; });

    route.get('/passwordsCoincidem/:userEmail/:inputPassword', (req, res, next) => {ctrl.checkPasswordsCoincidem(req, res, next); req.params.userEmail; req.params.inputPassword})

    route.get('/gerarToken/:username', (req, res, next) => {ctrl.gerarToken(req, res, next); req.params.username});

    route.get('/decodeToken/:token', (req, res, next) => {ctrl.decodeToken(req, res, next); req.params.token});

    route.put('/cancelarConta',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
            })
        }),
        (req, res, next) => ctrl.cancelarConta(req, res, next));
}