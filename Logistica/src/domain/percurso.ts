import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { PercursoId } from "./percursoId";
import { ArmazemId } from "./armazemId";
import { Distancia } from "./distancia";
import { Energia } from "./energia";
import { TempoPercurso } from "./tempoPercurso";

import IPercursoDTO from "../dto/IPercursoDTO";


interface PercursoProps {
    armazemPartida: ArmazemId;
    armazemChegada: ArmazemId;
    distancia: Distancia;
    duracao: TempoPercurso;
    energiaGasta: Energia;
    tempoExtra: TempoPercurso;
}

export class Percurso extends AggregateRoot<PercursoProps> {
    get id (): UniqueEntityID {
        return this._id;
    }

    get percursoId (): PercursoId {
        return new PercursoId(this.percursoId.id);
    }

    get armazemPartida(): ArmazemId {
        return this.props.armazemPartida;
    }

    get armazemChegada(): ArmazemId {
        return this.props.armazemChegada;
    }

    get distancia(): Distancia {
        return this.props.distancia;
    }

    get duracao(): TempoPercurso {
        return this.props.duracao;
    }

    get energiaGasta(): Energia {
        return this.props.energiaGasta;
    }

    get tempoExtra(): TempoPercurso {
        return this.props.tempoExtra;
    }

    set armazemPartida ( value: ArmazemId) {
        this.props.armazemPartida = value;
    }

    set armazemChegada ( value: ArmazemId) {
        this.props.armazemChegada = value;
    }
    
    set distancia ( value: Distancia) {
        this.props.distancia = value;
    }

    set duracao ( value: TempoPercurso) {
        this.props.duracao = value;
    }

    set energiaGasta ( value: Energia) {
        this.props.energiaGasta = value;
    }

    set tempoExtra ( value: TempoPercurso) {
        this.props.tempoExtra = value;
    }

    private constructor (props: PercursoProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create (percursoDTO: IPercursoDTO, id?: UniqueEntityID): Result<Percurso> {
       
        const percurso = new Percurso(
            {
                armazemPartida: ArmazemId.create(percursoDTO.armazemPartida).getValue(),
                armazemChegada: ArmazemId.create(percursoDTO.armazemChegada).getValue(),
                distancia: Distancia.create(percursoDTO.distancia).getValue(),
                duracao: TempoPercurso.create(percursoDTO.duracao).getValue(),
                energiaGasta: Energia.create(percursoDTO.energiaGasta).getValue(),
                tempoExtra: TempoPercurso.create(percursoDTO.tempoExtra).getValue(),
            },
            id
        );
        return Result.ok<Percurso>(percurso);
    }
}

