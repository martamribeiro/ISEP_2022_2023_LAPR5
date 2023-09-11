import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface TempoPercursoProps {
    minutos: number;
}

export class TempoPercurso extends ValueObject<TempoPercursoProps> {
    get minutos (): number {
        return this.props.minutos;
    }

    public constructor (props: TempoPercursoProps) {
        super(props);
    }

    public static create (min: number): Result<TempoPercurso> {
        const guardResult = Guard.againstNullOrUndefined(min, 'minutosPercurso');
        if(!guardResult.succeeded || min < 0) {
            return Result.fail<TempoPercurso>(guardResult.message);
        } else {
            return Result.ok<TempoPercurso>(new TempoPercurso({ minutos: min }))
        }
    }
}