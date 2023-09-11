import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IUtilizadorDTO from '../dto/IUtilizadorDTO';
import { Utilizador } from '../domain/utilizador';
import IUtilizadorRepo from './IRepos/IUtilizadorRepo';
import IUtilizadorService from './IServices/IUtilizadorService';
import { UtilizadorMap } from '../mappers/UtilizadorMap';
import { PrimeiroNome } from '../domain/primeiroNome';
import { UltimoNome } from '../domain/ultimoNome';
import { NumeroTelefone } from '../domain/numeroTelefone';
import { Password } from '../domain/password';
import { FuncaoUtilizador } from '../domain/funcaoUtilizador';
import { Email } from '../domain/email';
import bcrypt from 'bcrypt';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { Username } from '../domain/username';
import isAuth from '../api/middlewares/isAuth';

@Service()
export default class UtilizadorService implements IUtilizadorService{
    constructor(
        @Inject(config.repos.utilizador.name) private utilizadorRepo: IUtilizadorRepo  
    ){}

    async hashPassword(plainTextPassword: string): Promise<string>{
        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(plainTextPassword, salt);

        return hashedPassword;
    }

    async comparePasswords(storedUserEmail: string, inputPassword: string): Promise<Result<boolean>> {
        try{
            let storedUser = await this.getUtilizadorPorEmail(storedUserEmail);

            let storedHashedPassword = storedUser.getValue().password;

            return Result.ok<boolean>(await bcrypt.compare(inputPassword, storedHashedPassword));
        }catch(e){
            throw e;
        }
    }

    public async criarUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>> {
        try{
            let hashedPassword = await this.hashPassword(utilizadorDTO.password); 
            
            utilizadorDTO.password = hashedPassword;

            const utilizadorOuErro = await Utilizador.create(utilizadorDTO);

            if(utilizadorOuErro.isFailure){
                return Result.fail<IUtilizadorDTO>(utilizadorOuErro.getValue());
            }

            const utilizadorResult = utilizadorOuErro.getValue();

            await this.utilizadorRepo.save(utilizadorResult);

            const utilizadorDTOResult = UtilizadorMap.toDTO(utilizadorResult) as IUtilizadorDTO;

            return Result.ok<IUtilizadorDTO>(utilizadorDTOResult);
        }catch(e){
            throw e;
        }
    }

    public async editarUtilizador(username: string, email: string, primeiroNome: string, ultimoNome: string, password: string, numeroTelefone: number, funcaoUtilizador: string): Promise<Result<IUtilizadorDTO>> {
        try{
            const utilizador = await this.utilizadorRepo.findByUsername(username);

            if(utilizador === null){
                return Result.fail<IUtilizadorDTO>("Utilizador não encontrado");
            }else{
                utilizador.props.primeiroNome = new PrimeiroNome({primeiroNome: primeiroNome});
                utilizador.props.ultimoNome = new UltimoNome({ultimoNome: ultimoNome});
                utilizador.props.password = new Password({password: await this.hashPassword(password)});
                utilizador.props.numeroTelefone = new NumeroTelefone({numeroTelefone: numeroTelefone});
                utilizador.props.funcaoUtilizador = new FuncaoUtilizador({funcaoUtilizador: funcaoUtilizador});

                await this.utilizadorRepo.save(utilizador);

                const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;

                return Result.ok<IUtilizadorDTO>(utilizadorDTOResult);
            }
        }catch(e){
            throw e;
        }
    }

    public async listarUtilizadores(): Promise<Result<IUtilizadorDTO[]>> {
        let listaUtilizadores: IUtilizadorDTO[] = []

        const utilizadores = await this.utilizadorRepo.findAll();

        utilizadores.forEach((utilizador) => {
            listaUtilizadores.push(UtilizadorMap.toDTO(utilizador));
        });

        return Result.ok<IUtilizadorDTO[]>(listaUtilizadores);
    }

    public async getUtilizadorPorUsername(username: string): Promise<Result<IUtilizadorDTO>> {
        const utilizador = await this.utilizadorRepo.findByUsername(username);

        const utilizadorDTO = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;

        return Result.ok<IUtilizadorDTO>(utilizadorDTO);
    }

    public async getUtilizadorPorEmail(email: string): Promise<Result<IUtilizadorDTO>> {
        const utilizador = await this.utilizadorRepo.findByEmail(email);

        const utilizadorDTO = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;

        return Result.ok<IUtilizadorDTO>(utilizadorDTO);
    }

    public async cancelarConta(username: string): Promise<Result<IUtilizadorDTO>> {
        try{
            const utilizador = await this.utilizadorRepo.findByUsername(username);

            if(utilizador === null){
                return Result.fail<IUtilizadorDTO>("Utilizador não encontrado");
            }else{
         
                utilizador.props.password = await Password.create("XxxxXxxxx1111!").getValue();
                utilizador.props.numeroTelefone = await NumeroTelefone.create(999999999).getValue();
                utilizador.props.funcaoUtilizador = await FuncaoUtilizador.create("N/A").getValue();
                utilizador.props.email = await Email.create(username + "MailAnonimizado@xxxxx.xxxx").getValue();

                await this.utilizadorRepo.save(utilizador);

                const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;

                return Result.ok<IUtilizadorDTO>(utilizadorDTOResult);
            }
        }catch(e){
            throw e;
        }
    }

    public async gerarToken(username: string): Promise<Result<string>> {
        let utilizador = (await this.getUtilizadorPorUsername(username));

        let utilizadorDTO = utilizador.getValue();

        const token = this.generateToken(utilizadorDTO) as string;

        return Result.ok<string>(token);
    }

    public async decodeToken(token: string): Promise<Result<JwtPayload>> {
        const decodedToken = jwt.decode(token) as JwtPayload;

        console.log(decodedToken);

        return Result.ok<JwtPayload>(decodedToken);
    }

    private generateToken(utilizador: IUtilizadorDTO) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
    
        /**
         * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
         * The cool thing is that you can add custom properties a.k.a metadata
         * Here we are adding the userId, role and name
         * Beware that the metadata is public and can be decoded without _the secret_
         * but the client cannot craft a JWT to fake a userId
         * because it doesn't have _the secret_ to sign it
         * more information here: https://softwareontheroad.com/you-dont-need-passport
         */
        
        const username = utilizador.username;
        const email = utilizador.email;
        const primeiroNome = utilizador.primeiroNome;
        const ultimoNome = utilizador.ultimoNome;
        const funcao = utilizador.funcaoUtilizador;
    
        return jwt.sign(
        {
            username: username,
            email: email, // We are gonna use this in the middleware 'isAuth'
            funcao: funcao,
            primeiroNome: primeiroNome,
            ultimoNome: ultimoNome,
            exp: exp.getTime() / 1000,
          },
          config.jwtSecret,
        );
      }
}