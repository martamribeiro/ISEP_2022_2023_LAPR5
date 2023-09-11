import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface BateriaCamiaoProps {
    kWh: number; 
}

export class BateriaCamiao extends ValueObject<BateriaCamiaoProps> {
    get kWh (): number {
        return this.props.kWh;
    }
    
    public constructor (props: BateriaCamiaoProps) {
        super(props);
    }

    public static create (bateria: number): Result<BateriaCamiao> {
        const guardResult = Guard.againstNullOrUndefined(bateria, 'bateria');
        if (!guardResult.succeeded || bateria < 0) {
            return Result.fail<BateriaCamiao>(guardResult.message);
        } else {
            return Result.ok<BateriaCamiao>(new BateriaCamiao({ kWh: bateria }));
        }

    }
}