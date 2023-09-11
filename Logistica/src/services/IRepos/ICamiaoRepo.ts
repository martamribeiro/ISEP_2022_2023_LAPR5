import { Repo } from "../../core/infra/Repo";
import { Camiao } from "../../domain/camiao";
import { MatriculaCamiao } from "../../domain/matriculaCamiao";
import { NomeCamiao } from "../../domain/nomeCamiao";

export default interface ICamiaoRepo extends Repo<Camiao> {
    save(camiao: Camiao): Promise<Camiao>;
    findByDomainId (nomeCamiao: NomeCamiao | string): Promise<Camiao>;
    findAll(): Promise<Camiao[]>;
    findByMatricula(matriculaCamiao: string): Promise<Camiao>;
    findByAllActiveStatus(ativoCamiao: Boolean): Promise<Camiao[]>;
}