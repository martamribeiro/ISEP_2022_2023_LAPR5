import { Viagem } from "../../domain/viagem";

export default interface IArmazemRepo {
    findTrajMaisRapida(data: string, camiao: string): Promise<any[]>;
    findMelhorViagemHeuristicaArmazem(data: string, camiao: string): Promise<any[]>;
    findMelhorViagemHeuristicaEntrega(data: string, camiao: string): Promise<any[]>;
    findMelhorViagemHeuristicaTempoMassa(data: string, camiao: string): Promise<any[]>;
    save(viagem: Viagem): Promise<Viagem>;
    findAll(): Promise<Viagem[]>;
    obterPlaneamentoAlgoritmoSimulado(): string[];
    obterPlaneamentoAlgoritmoGenetico(data: string): Promise<any[]>;
}