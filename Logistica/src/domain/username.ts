import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface UsernameProps {
    username: string; 
}

export class Username extends ValueObject<UsernameProps> {
    get username (): string {
        return this.props.username;
    }
    
    public constructor (props: UsernameProps) {
        super(props);
    }

    public static create (username: string): Result<Username> {
        const guardResult = Guard.againstNullOrUndefined(username, 'username');
        if (!guardResult.succeeded || username.length <= 0) {
            return Result.fail<Username>(guardResult.message);
        } else {
            return Result.ok<Username>(new Username({ username: username }))
        }

    }
}