import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import ICamiaoController from './IControllers/ICamiaoController';
import ICamiaoService from '../services/IServices/ICamiaoService';
import ICamiaoDTO from '../dto/ICamiaoDTO';

import { Result } from "../core/logic/Result";
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export default class CamiaoController implements ICamiaoController{
    constructor(
        @Inject(config.services.camiao.name) private camiaoServiceInstance: ICamiaoService
    ){}

    public async listarCamioesAtivos(req: Request, res: Response, next: NextFunction){
        try{
            let aux = req.url.substring(18,req.url.length);

            let auxBoolean: boolean;

            if(aux === 'ativo'){
                auxBoolean = true;
            }else if(aux === 'desativo'){
                auxBoolean = false;
            }

            const camiaoOuErro = (await this.camiaoServiceInstance.listarCamioesAtivos(auxBoolean)) as Result<ICamiaoDTO[]>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camiaoDTO = camiaoOuErro.getValue();

            return res.status(201).json(camiaoDTO);
        }catch(e){
            return next(e);
        }
    }

    public async listarCamioesDesativos(req: Request, res: Response, next: NextFunction){
        try{
            let aux = req.url.substring(21,req.url.length);
            let auxBoolean: boolean;

            if(aux === 'ativo'){
                auxBoolean = true;
            }else if(aux === 'desativo'){
                auxBoolean = false;
            }

            const camiaoOuErro = (await this.camiaoServiceInstance.listarCamioesDesativos(auxBoolean)) as Result<ICamiaoDTO[]>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camiaoDTO = camiaoOuErro.getValue();

            return res.status(201).json(camiaoDTO);
        }catch(e){
            return next(e);
        }
    }

    public async listarCamioes(req: Request, res: Response, next: NextFunction) {
        try{
            const camiaoOuErro = (await this.camiaoServiceInstance.listarCamioes()) as Result<ICamiaoDTO[]>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camioesDTO = camiaoOuErro.getValue();

            return res.json(camioesDTO).status(201);
        }catch(e){
            return next(e);
        }
    }

    public async getCamiaoPorNome(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
        try{
            let aux = req.url.substring(15, req.url.length);

            const camiaoOuErro = (await this.camiaoServiceInstance.getCamiaoPorNome(aux)) as Result<ICamiaoDTO>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camioesDTO = camiaoOuErro.getValue();

            return res.json(camioesDTO).status(201);
        }catch(e){
            return next(e);
        }
    }

    public async criarCamiao(req: Request, res: Response, next: NextFunction) {
        try{
            const camiaoOuErro = (await this.camiaoServiceInstance.criarCamiao(req.body as ICamiaoDTO)) as Result<ICamiaoDTO>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camiaoDTO = camiaoOuErro.getValue();

            return res.status(201).json(camiaoDTO);
        }catch(e){
            return next(e);
        }
    }

    public async editarCamiao(req: Request, res: Response, next: NextFunction) {
        try{
            const camiaoOuErro = await this.camiaoServiceInstance.editarCamiao(req.body['nomeCamiao'],
                                                                                req.body['cargaTotalBaterias'],
                                                                                req.body['tara'],
                                                                                req.body['maximoCarga'],
                                                                                req.body['autonomia'],
                                                                                req.body['tempoCarregamento'],
                                                                                req.body['matriculaCamiao'],
                                                                                req.body['ativoCamiao']) as Result<ICamiaoDTO>;

            if(camiaoOuErro.isFailure){
                res.status(404).send();
            }

            const camiaoDTO = camiaoOuErro.getValue();

            return res.status(201).json(camiaoDTO);
        }catch(e){
            return next(e);
        }
    }
}