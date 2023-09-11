import { Repo } from "../../core/infra/Repo";
import { Utilizador } from "../../domain/utilizador";
import { Username } from "../../domain/username";
import { Email } from "../../domain/email";

export default interface IUtilizadorRepo extends Repo<Utilizador>{
    save(utilizador: Utilizador): Promise<Utilizador>;
    findAll(): Promise<Utilizador[]>;
    findByUsername(username: Username | string): Promise<Utilizador>;
    findByEmail(email: Email | string): Promise<Utilizador>;
}