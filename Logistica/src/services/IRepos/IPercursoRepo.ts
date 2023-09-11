import { Repo } from "../../core/infra/Repo";
import { Percurso } from "../../domain/percurso";
import { PercursoId } from "../../domain/percursoId";

export default interface IPercursoRepo extends Repo<Percurso> {
    save(percurso: Percurso): Promise<Percurso>;
    findByDomainId (percursoId: PercursoId | string): Promise<Percurso>;
    findAll(): Promise<Percurso[]>;
    findByArmazemPartida(armPartida: string): Promise<Percurso[]>;
    findByArmazemChegada(armChegada: string): Promise<Percurso[]>;
    findByArmPartidaEChegada(armPartida: string, armChegada: string): Promise<Percurso>;
    //findByIds (rolesIds: RoleId[]): Promise<Role[]>;
    //saveCollection (roles: Role[]): Promise<Role[]>;
    //removeByRoleIds (roles: RoleId[]): Promise<any>
}