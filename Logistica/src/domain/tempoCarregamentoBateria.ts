import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface TempoCarregamentoBateriaProps {
    minutos: number;
}

export class TempoCarregamentoBateria extends ValueObject<TempoCarregamentoBateriaProps> {
    get minutos (): number {
        return this.props.minutos;
    }

    public constructor (props: TempoCarregamentoBateriaProps) {
        super(props);
    }

    public static create (min: number): Result<TempoCarregamentoBateria> {
        const guardResult = Guard.againstNullOrUndefined(min, 'minutosPercurso');
        if(!guardResult.succeeded || min < 0) {
            return Result.fail<TempoCarregamentoBateria>(guardResult.message);
        } else {
            return Result.ok<TempoCarregamentoBateria>(new TempoCarregamentoBateria({ minutos: min }))
        }
    }
}