import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";

import { BateriaCamiao } from "./bateriaCamiao";
import { Autonomia } from "./autonomia";
import { MassaCamiao } from "./massaCamiao";
import { TempoCarregamentoBateria } from "./tempoCarregamentoBateria";
import { MatriculaCamiao } from "./matriculaCamiao";
import { NomeCamiao } from "./nomeCamiao";
import { AtivoCamiao } from "./ativoCamiao";

import ICamiaoDTO from "../dto/ICamiaoDTO";

interface CamiaoProps{
    nomeCamiao: NomeCamiao;
    cargaTotalBaterias: BateriaCamiao;
    tara: MassaCamiao;
    maximoCarga: MassaCamiao;
    autonomia: Autonomia;
    tempoCarregamento: TempoCarregamentoBateria;
    matriculaCamiao: MatriculaCamiao;
    ativoCamiao: AtivoCamiao;
}

export class Camiao extends AggregateRoot<CamiaoProps> {
    get id (): UniqueEntityID {
        return this._id;
    }

    get nomeCamiao(): NomeCamiao{
        return this.props.nomeCamiao;
    }

    get cargaTotalBaterias(): BateriaCamiao{
        return this.props.cargaTotalBaterias;
    }

    get tara(): MassaCamiao{
        return this.props.tara;
    }

    get maximoCarga(): MassaCamiao{
        return this.props.maximoCarga;
    }

    get autonomia(): Autonomia{
        return this.props.autonomia;
    }

    get tempoCarregamento(): TempoCarregamentoBateria{
        return this.props.tempoCarregamento;
    }

    get matriculaCamiao(): MatriculaCamiao{
        return this.props.matriculaCamiao;
    }

    get ativoCamiao(): AtivoCamiao{
        return this.props.ativoCamiao;
    }

    set nomeCamiao(value: NomeCamiao){
        this.props.nomeCamiao = value;
    }

    set cargaTotalBaterias(value: BateriaCamiao){
        this.props.cargaTotalBaterias = value;
    }

    set tara(value: MassaCamiao){
        this.props.tara = value;
    }

    set maximoCarga(value: MassaCamiao){
        this.props.maximoCarga = value;
    }

    set autonomia(value: Autonomia){
        this.props.autonomia = value;
    }

    set tempoCarregamento(value: TempoCarregamentoBateria){
        this.props.tempoCarregamento = value;
    }

    set matriculaCamiao(value: MatriculaCamiao){
        this.props.matriculaCamiao = value;
    }

    set ativoCamiao(value: AtivoCamiao){
        this.props.ativoCamiao = value;
    }

    private constructor (props: CamiaoProps, id?: UniqueEntityID){
        super(props, id);
    }

    public static create(camiaoDTO: ICamiaoDTO, id?: UniqueEntityID): Result<Camiao> {
        const camiao = new Camiao(
            {
                nomeCamiao: new NomeCamiao({nomeCamiao: camiaoDTO.nomeCamiao}),
                cargaTotalBaterias: new BateriaCamiao({kWh: camiaoDTO.cargaTotalBaterias}),
                tara: new MassaCamiao({kg: camiaoDTO.tara}),
                maximoCarga: new MassaCamiao({kg: camiaoDTO.maximoCarga}),
                autonomia: new Autonomia({km: camiaoDTO.autonomia}),
                tempoCarregamento: new TempoCarregamentoBateria({minutos: camiaoDTO.tempoCarregamento}),
                matriculaCamiao: new MatriculaCamiao({matriculaCamiao: camiaoDTO.matriculaCamiao}),
                ativoCamiao: new AtivoCamiao({ativoCamiao: camiaoDTO.ativoCamiao})
            },
            id
        );

        return Result.ok<Camiao>(camiao);
    }
}