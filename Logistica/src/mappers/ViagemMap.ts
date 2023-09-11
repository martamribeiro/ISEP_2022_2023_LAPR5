import { Mapper } from "../core/infra/Mapper";
import { Document, Model } from "mongoose";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Viagem } from "../domain/viagem";
import { IViagemPersistence } from "../dataschema/IViagemPersistence";
import IViagemDTO from "../dto/IViagemDTO";
import { NomeCamiao } from "../domain/nomeCamiao";
import { TempoPercurso } from "../domain/tempoPercurso";

export class ViagemMap extends Mapper<Viagem> {
  public static toDomain(
    viagem: any | Model<IViagemPersistence & Document>
  ): Viagem {
    const camiaoOrError = viagem.camiao;
    const dataOrError = viagem.data;
    const armazensOrError = viagem.armazens;
    const tempoViagemOrError = TempoPercurso.create(viagem.tempoViagem);

    const viagemOrError = Viagem.create(
      {
        camiao: camiaoOrError,
        data: dataOrError,
        armazens: armazensOrError,
        tempoViagem: tempoViagemOrError.getValue(),
      },
      new UniqueEntityID(viagem.domainId)
    );

    viagemOrError.isFailure ? console.log(viagemOrError.error) : "";

    return viagemOrError.isSuccess ? viagemOrError.getValue() : null;
  }

  public static toPersistence(viagem: Viagem): any {
    return {
      domainId: viagem.id.toString(),
      camiao: viagem.props.camiao,
      data: viagem.props.data,
      armazens: viagem.props.armazens,
      tempoViagem: viagem.props.tempoViagem.minutos,
    };
  }

  public static toDTO(viagem: Viagem): IViagemDTO {
    return {
      camiao: viagem.props.camiao,
      data: viagem.props.data,
      armazens: viagem.props.armazens,
      tempoViagem: viagem.props.tempoViagem.minutos,
    } as IViagemDTO;
  }
}
