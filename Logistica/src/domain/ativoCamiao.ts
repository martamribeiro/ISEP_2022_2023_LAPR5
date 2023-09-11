import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Entity } from "../core/domain/Entity";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

interface AtivoCamiaoProps{
    ativoCamiao: Boolean;
}

export class AtivoCamiao extends ValueObject<AtivoCamiaoProps>{
    get ativoCamiao (): Boolean {
        return this.props.ativoCamiao;
    }

    public constructor (props: AtivoCamiaoProps) {
        super(props);
    }

    public static create (active: Boolean): Result<AtivoCamiao> {
        const guardResult = Guard.againstNullOrUndefined(active, 'AtivoCamiao');
        if (!guardResult.succeeded) {
          return Result.fail<AtivoCamiao>(guardResult.message);
        } else {
          return Result.ok<AtivoCamiao>(new AtivoCamiao({ ativoCamiao: active}))
        }
    }
}