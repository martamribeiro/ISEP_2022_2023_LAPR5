import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface NumeroTelefoneProps {
    numeroTelefone: number; 
}

export class NumeroTelefone extends ValueObject<NumeroTelefoneProps> {
    get numeroTelefone (): number {
        return this.props.numeroTelefone;
    }
    
    public constructor (props: NumeroTelefoneProps) {
        super(props);
    }

    public static create (numeroTelefone: number): Result<NumeroTelefone> {
        const guardResult = Guard.againstNullOrUndefined(numeroTelefone, 'numeroTelefone');
        if (!guardResult.succeeded || numeroTelefone < 0) {
            return Result.fail<NumeroTelefone>(guardResult.message);
        } else {
            return Result.ok<NumeroTelefone>(new NumeroTelefone({ numeroTelefone: numeroTelefone }))
        }

    }
}