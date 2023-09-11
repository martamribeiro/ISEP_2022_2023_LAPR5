import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';

import IPercursoDTO from "../dto/IPercursoDTO";
import { Percurso } from "../domain/percurso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PercursoMap extends Mapper<Percurso> {
    public static toDTO( percurso: Percurso): IPercursoDTO {
        return {
            id: percurso.id.toString(),
            armazemPartida: percurso.armazemPartida.props.armazemId,
            armazemChegada: percurso.armazemChegada.props.armazemId,
            distancia: percurso.distancia.props.km,
            duracao: percurso.duracao.props.minutos,
            energiaGasta: percurso.energiaGasta.props.kWh,
            tempoExtra: percurso.tempoExtra.props.minutos,
        } as IPercursoDTO;
    }

    public static toDomain (percurso: any | Model<IPercursoPersistence & Document> ): Percurso {
        const percursoOrError = Percurso.create(
          percurso,
          new UniqueEntityID(percurso.domainId)
        );
    
        percursoOrError.isFailure ? console.log(percursoOrError.error) : '';
    
        return percursoOrError.isSuccess ? percursoOrError.getValue() : null;
    }

    public static toPersistence (percurso: Percurso): any {
        return {
            domainId: percurso.id.toString(),
            armazemPartida: percurso.armazemPartida.props.armazemId,
            armazemChegada: percurso.armazemChegada.props.armazemId,
            distancia: percurso.distancia.props.km,
            duracao: percurso.duracao.props.minutos,
            energiaGasta: percurso.energiaGasta.props.kWh,
            tempoExtra: percurso.tempoExtra.props.minutos,
        }
    }
}