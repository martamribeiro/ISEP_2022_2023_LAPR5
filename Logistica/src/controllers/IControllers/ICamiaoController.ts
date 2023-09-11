import { Request, Response, NextFunction } from 'express';

export default interface ICamiaoController  {
    listarCamioes(req: Request, res: Response, next: NextFunction);
    criarCamiao(req: Request, res: Response, next: NextFunction);
    editarCamiao(req: Request, res: Response, next: NextFunction);
    listarCamioesAtivos(req: Request, res: Response, next: NextFunction);
    listarCamioesDesativos(req: Request, res: Response, next: NextFunction);
    getCamiaoPorNome(req: Request, res: Response, next: NextFunction);
}