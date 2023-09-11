import { Entity } from "../core/domain/Entity";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PercursoId extends Entity<any> {
    get id (): UniqueEntityID {
        return this._id;
    }

    public constructor (id?: UniqueEntityID) {
        super(null, id)
    }
}