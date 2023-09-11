import { JwtPayload } from "jsonwebtoken";
import { Result } from "../../core/logic/Result";
import IUtilizadorDTO from "../../dto/IUtilizadorDTO";

export default interface IUtilizadorService{
    criarUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>>;
    editarUtilizador(username: string, email: string, primeiroNome: string, ultimoNome: string, password: string, numeroTelefone: number, funcaoUtilizador: string): Promise<Result<IUtilizadorDTO>>;
    listarUtilizadores(): Promise<Result<IUtilizadorDTO[]>>;
    getUtilizadorPorUsername(username: string): Promise<Result<IUtilizadorDTO>>;
    getUtilizadorPorEmail(email: string): Promise<Result<IUtilizadorDTO>>;
    cancelarConta(username: string): Promise<Result<IUtilizadorDTO>>;
    hashPassword(plainTextPassword: string): Promise<string>;
    comparePasswords(storedHashedPassword: string, inputHashedPassword: string): Promise<Result<boolean>>;
    gerarToken(username: string): Promise<Result<string>>;
    decodeToken(token: string): Promise<Result<JwtPayload>>
}