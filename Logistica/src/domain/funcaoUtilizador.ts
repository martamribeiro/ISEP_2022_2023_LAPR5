import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface FuncaoUtilizadorProps {
    funcaoUtilizador: string; 
}

export class FuncaoUtilizador extends ValueObject<FuncaoUtilizadorProps> {
    get funcaoUtilizador (): string {
        return this.props.funcaoUtilizador;
    }
    
    public constructor (props: FuncaoUtilizadorProps) {
        super(props);
    }

    public static create (funcaoUtilizador: string): Result<FuncaoUtilizador> {
        const guardResult = Guard.againstNullOrUndefined(funcaoUtilizador, 'funcaoUtilizador');
        if (!guardResult.succeeded || funcaoUtilizador.length <= 0) {
            return Result.fail<FuncaoUtilizador>(guardResult.message);
        } else {
            return Result.ok<FuncaoUtilizador>(new FuncaoUtilizador({ funcaoUtilizador: funcaoUtilizador }))
        }

    }
}