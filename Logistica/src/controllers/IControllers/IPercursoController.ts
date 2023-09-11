import { Request, Response, NextFunction } from 'express';

export default interface IPercursoController  {
    listarPercursos(req: Request, res: Response, next: NextFunction);
    criarPercurso(req: Request, res: Response, next: NextFunction);
    editarPercurso(req: Request, res: Response, next: NextFunction);
    listarPercursosPorArmazemPartida(req: Request, res: Response, next: NextFunction);
    listarPercursosPorArmazemChegada(req: Request, res: Response, next: NextFunction);
    listarPercursosPorArmPartidaEChegada(req: Request, res: Response, next: NextFunction);
  }