import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Result } from "../core/logic/Result";
import { ArmazemId } from "./armazemId";
import { PercursoId } from "./percursoId";
import { Guard } from "../core/logic/Guard";
import { ViagemId } from "./viagemId";
import { NomeCamiao } from "./nomeCamiao";
import { TempoPercurso } from "./tempoPercurso";

interface ViagemProps {
  camiao: string;
  data: string;
  armazens: string[];
  tempoViagem: TempoPercurso;
}

export class Viagem extends AggregateRoot<ViagemProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get percursoId(): ViagemId {
    return PercursoId.caller(this.id);
  }

  get camiao(): string {
    return this.props.camiao;
  }

  get data(): string {
    return this.props.data;
  }

  get armazens(): string[] {
    return this.props.armazens;
  }

  get tempoViagem(): TempoPercurso {
    return this.props.tempoViagem;
  }

  set camiao(value: string) {
    this.props.camiao = value;
  }

  set data(value: string) {
    this.props.data = value;
  }

  set armazens(value: string[]) {
    this.props.armazens = value;
  }

  set tempoViagem(value: TempoPercurso) {
    this.props.tempoViagem = value;
  }

  private constructor(props: ViagemProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ViagemProps,
    id?: UniqueEntityID
  ): Result<Viagem> {
    const viagem = [
      { argument: props.camiao, argumentName: "camiao" },
      { argument: props.data, argumentName: "data" },
      { argument: props.armazens, argumentName: "armazens" },
      { argument: props.tempoViagem, argumentName: "tempoViagem" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(viagem);

    if (!guardResult.succeeded) {
      return Result.fail<Viagem>(guardResult.message);
    } else {
      const viagem = new Viagem(
        {
          ...props,
        },
        id
      );

      return Result.ok<Viagem>(viagem);
    }
  }
}
