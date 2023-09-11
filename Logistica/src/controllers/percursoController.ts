import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IPercursoController from "./IControllers/IPercursoController";
import IPercursoService from '../services/IServices/IPercursoService';
import IPercursoDTO from '../dto/IPercursoDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class PercursoController implements IPercursoController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.percurso.name) private percursoServiceInstance : IPercursoService
  ) {}
  
  public async listarPercursosPorArmazemPartida(req: Request, res: Response, next: NextFunction) {
    try {
      let aux = req.url.substring(19,req.url.length);

      const percursosOrError = (await this.percursoServiceInstance.listarPercursosPorArmazemPartida(aux)) as Result<IPercursoDTO []>;

      if (percursosOrError.isFailure) {
        return res.status(402).send();
      }

      const percursosDTO = percursosOrError.getValue();
      return res.json(percursosDTO).status(201);
    } 
    catch (e) {
      return next(e);
    }

  }

  public async listarPercursosPorArmazemChegada(req: Request, res: Response, next: NextFunction) {
    try {
      let aux = req.url.substring(19,req.url.length);

      const percursosOrError = (await this.percursoServiceInstance.listarPercursosPorArmazemChegada(aux)) as Result<IPercursoDTO []>;

      if (percursosOrError.isFailure) {
        return res.status(402).send();
      }

      const percursosDTO = percursosOrError.getValue();
      return res.json(percursosDTO).status(201);
    } 
    catch (e) {
      return next(e);
    }

  }

  public async listarPercursosPorArmPartidaEChegada(req: Request, res: Response, next: NextFunction) {
    try {

      const auxArmPartida = req.params.armazemPartida;
      const auxArmChegada = req.params.armazemChegada;

      const percursosOrError = (await this.percursoServiceInstance.listarPercursosPorArmPartidaEChegada(auxArmPartida, auxArmChegada)) as Result<IPercursoDTO>;

      if (percursosOrError.isFailure) {
        return res.status(402).send();
      }

      const percursosDTO = percursosOrError.getValue();
      return res.json(percursosDTO).status(201);
    } 
    catch (e) {
      return next(e);
    }

  }

    
  public async listarPercursos(req: Request, res: Response, next: NextFunction) {
    try {
      const percursosOrError = (await this.percursoServiceInstance.listarPercursos()) as Result<IPercursoDTO[]>;

      if (percursosOrError.isFailure) {
          return res.status(402).send();
      }

      const percursosDTO = percursosOrError.getValue();
      return res.json(percursosDTO).status(201);
    } 
    catch (e) {
      return next(e);
    }
  }

  public async criarPercurso(req: Request, res: Response, next: NextFunction) {
    try {
      const percursoOrError = await this.percursoServiceInstance.criarPercurso(req.body as IPercursoDTO) as Result<IPercursoDTO>;
        
      if (percursoOrError.isFailure) {
        return res.status(402).send();
      }

      const percursoDTO = percursoOrError.getValue();
      return res.json( percursoDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async editarPercurso(req: Request, res: Response, next: NextFunction) {
    try {
      const percursoOrError = await this.percursoServiceInstance.editarPercurso(req.body['armazemPartida'], 
                                                                                req.body['armazemChegada'],
                                                                                req.body['distancia'],
                                                                                req.body['duracao'],
                                                                                req.body['energiaGasta'],
                                                                                req.body['tempoExtra']) as Result<IPercursoDTO>;

      if (percursoOrError.isFailure) {
        return res.status(404).send();
      }

      const percursoDTO = percursoOrError.getValue();
      return res.status(201).json( percursoDTO );
    }
    catch (e) {
      return next(e);
    }
  };
  

}