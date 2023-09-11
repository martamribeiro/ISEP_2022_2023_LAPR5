import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface PasswordProps {
    password: string; 
}

export class Password extends ValueObject<PasswordProps> {
    get password (): string {
        return this.props.password;
    }
    
    public constructor (props: PasswordProps) {
        super(props);
    }

    public static create (password: string): Result<Password> {
        const guardResult = Guard.againstNullOrUndefined(password, 'password');
        if (!guardResult.succeeded || password.length <= 0) {
            return Result.fail<Password>(guardResult.message);
        } else {
            return Result.ok<Password>(new Password({ password: password }))
        }

    }
}