import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface EnergiaProps {
    kWh: number; 
}

export class Energia extends ValueObject<EnergiaProps> {
    get kWh (): number {
        return this.props.kWh;
    }
    
    public constructor (props: EnergiaProps) {
        super(props);
    }

    public static create (energia: number): Result<Energia> {
        const guardResult = Guard.againstNullOrUndefined(energia, 'energia');
        if (!guardResult.succeeded || energia < 0) {
            return Result.fail<Energia>(guardResult.message);
        } else {
            return Result.ok<Energia>(new Energia({ kWh: energia }))
        }

    }
}