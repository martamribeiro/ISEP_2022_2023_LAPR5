import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Inject, Service } from "typedi";
import config from "../../config";
import IViagemDTO from "../dto/IViagemDTO";
import IPlaneamentoService from "../services/IServices/IPlaneamentoService";
import IPlaneamentoController from "./IControllers/IPlaneamentoController";
import { Result } from "../core/logic/Result";

@Service()
export default class PlaneamentoController implements IPlaneamentoController{

    constructor(
        @Inject(config.services.planeamento.name) private planeamentoServiceInstance : IPlaneamentoService
    ) {}
  
  
  
    public async obterPlaneamento(req: Request, res: Response, next: NextFunction) {
        try {
        
            const data = req.params.data;
            const camiao = req.params.camiao;
      
            const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamento(
              data, camiao)) as Result<IViagemDTO>;
      
            if (planeamentoOrError.isFailure) {
              return res.status(402).send();
            }
      
            const viagemDTO = planeamentoOrError.getValue();
            return res.json(viagemDTO).status(201);
          } 
          catch (e) {
            return next(e);
          }
    }

    public async obterPlaneamentoHeuristicaArmazem(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
      try {
          
        const data = req.params.data;
        const camiao = req.params.camiao;

        const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamentoHeuristicaArmazem(
          data, camiao)) as Result<IViagemDTO>;
  
        if (planeamentoOrError.isFailure) {
          return res.status(402).send();
        }
  
        const viagemDTO = planeamentoOrError.getValue();
        return res.json(viagemDTO).status(201);
      } 
      catch (e) {
        return next(e);
      }
    }

    public async obterPlaneamentoHeuristicaEntrega(req: Request, res: Response, next: NextFunction) {
      try {
          
        const data = req.params.data;
        const camiao = req.params.camiao;

        const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamentoHeuristicaEntrega(
          data, camiao)) as Result<IViagemDTO>;
  
        if (planeamentoOrError.isFailure) {
          return res.status(402).send();
        }
  
        const viagemDTO = planeamentoOrError.getValue();
        return res.json(viagemDTO).status(201);
      } 
      catch (e) {
        return next(e);
      }
    }

    public async obterPlaneamentoHeuristicaTempoMassa(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) {
      try {
          
        const data = req.params.data;
        const camiao = req.params.camiao;

        const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamentoHeuristicaTempoMassa(
          data, camiao)) as Result<IViagemDTO>;
  
        if (planeamentoOrError.isFailure) {
          return res.status(402).send();
        }
  
        const viagemDTO = planeamentoOrError.getValue();
        return res.json(viagemDTO).status(201);
      } 
      catch (e) {
        return next(e);
      }
    }

    public async obterPlaneamentoAlgoritmoSimulado(req: Request, res: Response, next: NextFunction) {
      try {
    
          const data = req.params.data;

          const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamentoAlgoritmoSimulado(data)) as Result<IViagemDTO[]>;
    
          if (planeamentoOrError.isFailure) {
            return res.status(402).send();
          }
    
          const viagemDTO = planeamentoOrError.getValue();
          return res.json(viagemDTO).status(201);
        } 
        catch (e) {
          return next(e);
        }
  }

  public async listarViagens(req: Request, res: Response, next: NextFunction) {
    try {
      const viagensOrError = (await this.planeamentoServiceInstance.listarViagens()) as Result<IViagemDTO[]>;

      if (viagensOrError.isFailure) {
          return res.status(402).send();
      }

      const viagensDTO = viagensOrError.getValue();
      return res.json(viagensDTO).status(201);
    } 
    catch (e) {
      return next(e);
    }
  }

  public async obterPlaneamentoAlgoritmoGenetico(req: Request, res: Response, next: NextFunction) {
    try {
  
        const data = req.params.data;

        const planeamentoOrError = (await this.planeamentoServiceInstance.obterPlaneamentoAlgoritmoGenetico(data)) as Result<IViagemDTO[]>;
  
        if (planeamentoOrError.isFailure) {
          return res.status(402).send();
        }
  
        const viagemDTO = planeamentoOrError.getValue();
        return res.json(viagemDTO).status(201);
      } 
      catch (e) {
        return next(e);
      }
}

}