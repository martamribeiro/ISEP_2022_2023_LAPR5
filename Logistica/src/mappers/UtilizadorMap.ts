import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IUtilizadorPersistence } from "../dataschema/IUtilizadorPersistence";

import IUtilizadorDTO from "../dto/IUtilizadorDTO";
import { Utilizador } from "../domain/utilizador";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class UtilizadorMap extends Mapper<Utilizador>{
    public static toDTO(utilizador: Utilizador): IUtilizadorDTO{
        return{
            username: utilizador.username.props.username,
            email: utilizador.email.props.email,
            primeiroNome: utilizador.primeiroNome.props.primeiroNome,
            ultimoNome: utilizador.ultimoNome.props.ultimoNome,
            password: utilizador.password.props.password,
            numeroTelefone: utilizador.numeroTelefone.props.numeroTelefone,
            funcaoUtilizador: utilizador.funcaoUtilizador.props.funcaoUtilizador
        } as IUtilizadorDTO;
    }

    public static toDomain(utilizador: any | Model<IUtilizadorPersistence & Document>): Utilizador{
        const utilizadorOuErro = Utilizador.create(
            utilizador
        );

        utilizadorOuErro.isFailure ? console.log(utilizadorOuErro.error) : '';

        return utilizadorOuErro.isSuccess ? utilizadorOuErro.getValue() : null;
    }

    public static toPersistence(utilizador: Utilizador): any{
        return{
            username: utilizador.username.props.username,
            email: utilizador.email.props.email,
            primeiroNome: utilizador.primeiroNome.props.primeiroNome,
            ultimoNome: utilizador.ultimoNome.props.ultimoNome,
            password: utilizador.password.props.password,
            numeroTelefone: utilizador.numeroTelefone.props.numeroTelefone,
            funcaoUtilizador: utilizador.funcaoUtilizador.props.funcaoUtilizador
        }
    }
}