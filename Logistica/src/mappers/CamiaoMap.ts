import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { ICamiaoPersistence } from "../dataschema/ICamiaoPersistence";

import ICamiaoDTO from "../dto/ICamiaoDTO";
import { Camiao } from "../domain/camiao";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class CamiaoMap extends Mapper<Camiao>{

    public static toDTO(camiao: Camiao): ICamiaoDTO{
        return{
            id: camiao.id.toString(),
            nomeCamiao: camiao.nomeCamiao.props.nomeCamiao,
            cargaTotalBaterias: camiao.cargaTotalBaterias.kWh,
            tara: camiao.tara.props.kg,
            maximoCarga: camiao.maximoCarga.props.kg,
            autonomia: camiao.autonomia.props.km,
            tempoCarregamento: camiao.tempoCarregamento.props.minutos,
            matriculaCamiao: camiao.matriculaCamiao.props.matriculaCamiao,
            ativoCamiao: camiao.ativoCamiao.props.ativoCamiao,
        } as ICamiaoDTO;
    }

    public static toDomain(camiao: any | Model<ICamiaoPersistence & Document>): Camiao{
        const camiaoOuErro = Camiao.create(
            camiao,
            new UniqueEntityID(camiao.domainId)
        );

        camiaoOuErro.isFailure ? console.log(camiaoOuErro.error) : '';

        return camiaoOuErro.isSuccess ? camiaoOuErro.getValue() : null;
    }

    public static toPersistence(camiao: Camiao): any{
        return{
            domainId: camiao.id.toString(),
            nomeCamiao: camiao.nomeCamiao.props.nomeCamiao,
            cargaTotalBaterias: camiao.cargaTotalBaterias.props.kWh,
            tara: camiao.tara.props.kg,
            maximoCarga: camiao.maximoCarga.props.kg,
            autonomia: camiao.autonomia.props.km,
            tempoCarregamento: camiao.tempoCarregamento.props.minutos,
            matriculaCamiao: camiao.matriculaCamiao.props.matriculaCamiao,
            ativoCamiao: camiao.ativoCamiao.props.ativoCamiao,
        }
    }
}