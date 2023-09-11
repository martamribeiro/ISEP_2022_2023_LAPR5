import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IUtilizadorController from './IControllers/IUtilizadorController';
import IUtilizadorService from '../services/IServices/IUtilizadorService';
import IUtilizadorDTO from '../dto/IUtilizadorDTO';

import { Result } from "../core/logic/Result";
import { JwtPayload } from 'jsonwebtoken';

@Service()
export default class UtilizadorController implements IUtilizadorController{
    constructor(
        @Inject(config.services.utilizador.name) private utilizadorService: IUtilizadorService
    ){}

    public async checkPasswordsCoincidem(req: Request, res: Response, next: NextFunction) {
        try{
            const storedUserEmail = req.params.userEmail;
            const inputPassword = req.params.inputPassword;

            const passwordsCoincidem = (await this.utilizadorService.comparePasswords(storedUserEmail, inputPassword)) as Result<boolean>;

            if(passwordsCoincidem.isFailure){
                res.status(404).send();
            }

            const passwordsCoincidemValue = passwordsCoincidem.getValue();

            return res.status(201).json(passwordsCoincidemValue);
        }catch(e){
            throw e;
        }
    }
    
    public async criarUtilizador(req: Request, res: Response, next: NextFunction) {
        try{
            const utilizadorOuErro = (await this.utilizadorService.criarUtilizador(req.body as IUtilizadorDTO)) as Result<IUtilizadorDTO>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async editarUtilizador(req: Request, res: Response, next: NextFunction) {
        try{
            const utilizadorOuErro = await this.utilizadorService.editarUtilizador(req.body['username'],
                                                                                req.body['email'],
                                                                                req.body['primeiroNome'],
                                                                                req.body['ultimoNome'],
                                                                                req.body['password'],
                                                                                req.body['numeroTelefone'],
                                                                                req.body['funcaoUtilizador']) as Result<IUtilizadorDTO>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async listarUtilizadores(req: Request, res: Response, next: NextFunction) {
        try{
            const utilizadorOuErro = (await this.utilizadorService.listarUtilizadores()) as Result<IUtilizadorDTO[]>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async getUtilizadorPorEmail(req: Request, res: Response, next: NextFunction) {
        try{
            let email = req.url.substring(10,req.url.length);

            const utilizadorOuErro = (await this.utilizadorService.getUtilizadorPorEmail(email)) as Result<IUtilizadorDTO>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async getUtilizadorPorUsername(req: Request, res: Response, next: NextFunction) {
        try{
            let username = req.url.substring(13,req.url.length);

            const utilizadorOuErro = (await this.utilizadorService.getUtilizadorPorUsername(username)) as Result<IUtilizadorDTO>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async cancelarConta(req: Request, res: Response, next: NextFunction) {
        try{
            const utilizadorOuErro = await this.utilizadorService.cancelarConta(req.body['username']) as Result<IUtilizadorDTO>;

            if(utilizadorOuErro.isFailure){
                res.status(404).send();
            }

            const utilizadorDTO = utilizadorOuErro.getValue();

            return res.status(201).json(utilizadorDTO);
        }catch(e){
            return next(e);
        }
    }

    public async gerarToken(req: Request, res: Response, next: NextFunction){
        try{
            let username = req.params.username;

            const token = (await this.utilizadorService.gerarToken(username)) as Result<string>;

            if(token.isFailure){
                res.status(404).send();
            }

            const userToken = token.getValue();

            return res.status(201).json(userToken);
        }catch(e){
            throw e;
        }
    }

    public async decodeToken(req: Request, res: Response, next: NextFunction){
        try{
            let token = req.params.token;

            const payload = (await this.utilizadorService.decodeToken(token)) as Result<JwtPayload>;

            if(payload.isFailure){
                res.status(404).send();
            }

            const tokenPayload = payload.getValue();

            return res.status(201).json(tokenPayload);
        }catch(e){
            throw e;
        }
    }
}