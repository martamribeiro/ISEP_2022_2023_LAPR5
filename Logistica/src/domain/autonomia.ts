import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface AutonomiaProps {
    km: number;
}
  
export class Autonomia extends ValueObject<AutonomiaProps> {
    get autonomia (): number {
      return this.props.km;
    }
    
    public constructor (props: AutonomiaProps) {
      super(props);
    }
  
    public static create (autonomia: number): Result<Autonomia> {
      const guardResult = Guard.againstNullOrUndefined(autonomia, 'distancia');
      if (!guardResult.succeeded || autonomia < 0) {
        return Result.fail<Autonomia>(guardResult.message);
      } else {
        return Result.ok<Autonomia>(new Autonomia({ km: autonomia }))
      }
    }
  }