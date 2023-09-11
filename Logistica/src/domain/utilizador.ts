import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";

import { Email } from "./email";
import { NumeroTelefone } from "./numeroTelefone";
import { Password } from "./password";
import { PrimeiroNome } from "./primeiroNome";
import { UltimoNome } from "./ultimoNome";
import { Username } from "./username";
import { FuncaoUtilizador } from "./funcaoUtilizador";

import IUtilizadorDTO from "../dto/IUtilizadorDTO";

interface UtilizadorProps{
    username: Username;
    email: Email;
    primeiroNome: PrimeiroNome;
    ultimoNome: UltimoNome;
    password: Password;
    numeroTelefone: NumeroTelefone;
    funcaoUtilizador: FuncaoUtilizador;
}

export class Utilizador extends AggregateRoot<UtilizadorProps>{
    get username (): Username{
        return this.props.username;
    }
    get email (): Email{
        return this.props.email;
    }
    get primeiroNome (): PrimeiroNome{
        return this.props.primeiroNome;
    }
    get ultimoNome (): UltimoNome{
        return this.props.ultimoNome;
    }
    get password (): Password{
        return this.props.password;
    }
    get numeroTelefone (): NumeroTelefone{
        return this.props.numeroTelefone;
    }
    get funcaoUtilizador (): FuncaoUtilizador{
        return this.props.funcaoUtilizador;
    }

    private constructor (props: UtilizadorProps){
        super(props);
    }

    public static create(utilizadorDTO: IUtilizadorDTO): Result<Utilizador> {
        const utilizador = new Utilizador(
            {
                username: new Username({username: utilizadorDTO.username}),
                email: new Email({email: utilizadorDTO.email}),
                primeiroNome: new PrimeiroNome({primeiroNome: utilizadorDTO.primeiroNome}),
                ultimoNome: new UltimoNome({ultimoNome: utilizadorDTO.ultimoNome}),
                password: new Password({password: utilizadorDTO.password}),
                numeroTelefone: new NumeroTelefone({numeroTelefone: utilizadorDTO.numeroTelefone}),
                funcaoUtilizador: new FuncaoUtilizador({funcaoUtilizador: utilizadorDTO.funcaoUtilizador})
            },
        );

        return Result.ok<Utilizador>(utilizador);
    }
}