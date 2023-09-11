import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface UltimoNomeProps {
    ultimoNome: string; 
}

export class UltimoNome extends ValueObject<UltimoNomeProps> {
    get ultimoNome (): string {
        return this.props.ultimoNome;
    }
    
    public constructor (props: UltimoNomeProps) {
        super(props);
    }

    public static create (ultimoNome: string): Result<UltimoNome> {
        const guardResult = Guard.againstNullOrUndefined(ultimoNome, 'ultimoNome');
        if (!guardResult.succeeded || ultimoNome.length <= 0) {
            return Result.fail<UltimoNome>(guardResult.message);
        } else {
            return Result.ok<UltimoNome>(new UltimoNome({ ultimoNome: ultimoNome }))
        }

    }
}