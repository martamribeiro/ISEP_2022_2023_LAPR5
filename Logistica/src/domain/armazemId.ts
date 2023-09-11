
import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface ArmazemIdProps {
    armazemId: string;
  }

export class ArmazemId extends ValueObject<ArmazemIdProps> {
    get armazemId (): string {
        return this.props.armazemId;
    }

    public constructor (props: ArmazemIdProps) {
        super(props);
    }

    public static create (id: string): Result<ArmazemId> {
        const guardResult = Guard.againstNullOrUndefined(id, 'ArmazemId');
        if (!guardResult.succeeded) {
          return Result.fail<ArmazemId>(guardResult.message);
        } else {
          return Result.ok<ArmazemId>(new ArmazemId({ armazemId: id }))
        }
    }
}