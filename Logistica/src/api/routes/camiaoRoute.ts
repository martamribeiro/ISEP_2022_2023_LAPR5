import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICamiaoController from '../../controllers/IControllers/ICamiaoController';

import config from "../../../config";

const route = Router();

export default (app: Router) => {
    app.use('/camioes', route);

    const ctrl = Container.get(config.controllers.camiao.name) as ICamiaoController;

    route.post('',
        celebrate({
            body: Joi.object({
                nomeCamiao: Joi.string().required(),
                cargaTotalBaterias: Joi.number().required(),
                tara: Joi.number().required(),
                maximoCarga: Joi.number().required(),
                autonomia: Joi.number().required(),
                tempoCarregamento: Joi.number().required(),
                matriculaCamiao: Joi.string().regex(new RegExp('([0-9]{2}-[0-9]{2}-[A-Za-z])|([A-Za-z]{2}[ \t\r\n\v\f][0-9]{2}[ \t\r\n\v\f][A-Za-z]{2})')).required(),
                ativoCamiao: Joi.boolean().required()
            })
        }),
        (req, res, next) => ctrl.criarCamiao(req, res, next));

    route.put('',
        celebrate({
            body: Joi.object({
                nomeCamiao: Joi.string().required(),
                cargaTotalBaterias: Joi.number().required(),
                tara: Joi.number().required(),
                maximoCarga: Joi.number().required(),
                autonomia: Joi.number().required(),
                tempoCarregamento: Joi.number().required(),
                matriculaCamiao: Joi.string().required(),
                ativoCamiao: Joi.boolean().required()
            })
        }),
        (req, res, next) => ctrl.editarCamiao(req, res, next));

    route.get('/camioesExistentes', (req, res, next) => ctrl.listarCamioes(req, res, next));

    route.get('/porCamioesAtivos/:camiaoAtivo', (req, res, next) => { ctrl.listarCamioesAtivos(req, res, next); req.params.camiaoAtivo; } );

    route.get('/porCamioesDesativos/:camiaoDesativo', (req, res, next) => { ctrl.listarCamioesDesativos(req, res, next); req.params.camiaoDesativo; } );

    route.get('/porNomeCamiao/:nomeCamiao', (req, res, next) => { ctrl.getCamiaoPorNome(req, res, next); req.params.nomeCamiao; } );
}