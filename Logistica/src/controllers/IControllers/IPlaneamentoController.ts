import { Request, Response, NextFunction } from 'express';

export default interface IPlaneamentoController  {
    obterPlaneamento(req: Request, res: Response, next: NextFunction);
    obterPlaneamentoHeuristicaArmazem(req: Request, res: Response, next: NextFunction);
    obterPlaneamentoHeuristicaEntrega(req: Request, res: Response, next: NextFunction);
    obterPlaneamentoHeuristicaTempoMassa(req: Request, res: Response, next: NextFunction);
    obterPlaneamentoAlgoritmoSimulado(req: Request, res: Response, next: NextFunction);
    listarViagens(req: Request, res: Response, next: NextFunction);
    obterPlaneamentoAlgoritmoGenetico(req: Request, res: Response, next: NextFunction);
}