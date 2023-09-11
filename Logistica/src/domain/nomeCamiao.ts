import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";
import { Entity } from "../core/domain/Entity";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

interface NomeCamiaoProps{
    nomeCamiao: string;
}

export class NomeCamiao extends ValueObject<NomeCamiaoProps>{
    get nomeCamiao (): string {
        return this.props.nomeCamiao;
    }

    public constructor (props: NomeCamiaoProps) {
        super(props);
    }

    public static create (id: string): Result<NomeCamiao> {
        const guardResult = Guard.againstNullOrUndefined(id, 'NomeCamiao');
        if (!guardResult.succeeded) {
          return Result.fail<NomeCamiao>(guardResult.message);
        } else {
          return Result.ok<NomeCamiao>(new NomeCamiao({ nomeCamiao: id}))
        }
    }
}