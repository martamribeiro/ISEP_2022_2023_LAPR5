import { Request, Response, NextFunction } from 'express';

export default interface IUtilizadorController{
    criarUtilizador(req: Request, res: Response, next: NextFunction): any;
    editarUtilizador(req: Request, res: Response, next: NextFunction): any;
    listarUtilizadores(req: Request, res: Response, next: NextFunction): any;
    getUtilizadorPorUsername(req: Request, res: Response, next: NextFunction): any;
    getUtilizadorPorEmail(req: Request, res: Response, next: NextFunction): any;
    cancelarConta(req: Request, res: Response, next: NextFunction): any;
    checkPasswordsCoincidem(req: Request, res: Response, next: NextFunction): any;
    gerarToken(req: Request, res: Response, next: NextFunction): any;
    decodeToken(req: Request, res: Response, next: NextFunction): any;
}