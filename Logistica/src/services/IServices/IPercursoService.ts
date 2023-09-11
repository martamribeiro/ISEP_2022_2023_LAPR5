import { Result } from "../../core/logic/Result";
import IPercursoDTO from "../../dto/IPercursoDTO";

export default interface IPercursoService  {
    criarPercurso(percursoDTO: IPercursoDTO): Promise<Result<IPercursoDTO>>;
    editarPercurso(armazemPartida: string, armazemChegada: string, distancia: number, duracao: number, energiaGasta: number, tempoExtra: number): Promise<Result<IPercursoDTO>>;
    listarPercursos(): Promise<Result<IPercursoDTO[]>>;
    listarPercursosPorArmazemPartida(armPartida: string):  Promise<Result<IPercursoDTO[]>>;
    listarPercursosPorArmazemChegada(armChegada: string):  Promise<Result<IPercursoDTO[]>>;
    listarPercursosPorArmPartidaEChegada(armPartida: string, armChegada: string): Promise<Result<IPercursoDTO>>;
    //getRole (roleId: string): Promise<Result<IRoleDTO>>;
}