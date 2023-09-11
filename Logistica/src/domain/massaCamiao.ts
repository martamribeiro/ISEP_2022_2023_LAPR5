import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface MassaCamiaoProps {
    kg: number;
}
  
export class MassaCamiao extends ValueObject<MassaCamiaoProps> {
  get massaCamiao (): number {
    return this.props.kg;
  }
    
  public constructor (props: MassaCamiaoProps) {
    super(props);
  }
  
  public static create (massa: number): Result<MassaCamiao> {
    const guardResult = Guard.againstNullOrUndefined(massa, 'massa');
      if (!guardResult.succeeded || massa < 0) {
        return Result.fail<MassaCamiao>(guardResult.message);
      } else {
        return Result.ok<MassaCamiao>(new MassaCamiao({ kg: massa }))
      }
  }
}