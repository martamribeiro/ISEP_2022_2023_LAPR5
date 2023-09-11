import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface PrimeiroNomeProps {
    primeiroNome: string; 
}

export class PrimeiroNome extends ValueObject<PrimeiroNomeProps> {
    get primeiroNome (): string {
        return this.props.primeiroNome;
    }
    
    public constructor (props: PrimeiroNomeProps) {
        super(props);
    }

    public static create (primeiroNome: string): Result<PrimeiroNome> {
        const guardResult = Guard.againstNullOrUndefined(primeiroNome, 'primeiroNome');
        if (!guardResult.succeeded || primeiroNome.length <= 0) {
            return Result.fail<PrimeiroNome>(guardResult.message);
        } else {
            return Result.ok<PrimeiroNome>(new PrimeiroNome({ primeiroNome: primeiroNome }))
        }

    }
}