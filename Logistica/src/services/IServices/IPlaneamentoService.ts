import { Result } from "../../core/logic/Result";
import IViagemDTO from "../../dto/IViagemDTO";

export default interface IPercursoService  {
    obterPlaneamento(data: string, camiao: string): Promise<Result<IViagemDTO>>;
    obterPlaneamentoHeuristicaArmazem(data: string, camiao: string): Promise<Result<IViagemDTO>>;
    obterPlaneamentoHeuristicaEntrega(data: string, camiao: string): Promise<Result<IViagemDTO>>;
    obterPlaneamentoHeuristicaTempoMassa(data: string, camiao: string): Promise<Result<IViagemDTO>>;
    obterPlaneamentoAlgoritmoSimulado(data: string): Promise<Result<IViagemDTO[]>>;
    listarViagens(): Promise<Result<IViagemDTO[]>>;
    obterPlaneamentoAlgoritmoGenetico(data: string): Promise<Result<IViagemDTO[]>>;
}