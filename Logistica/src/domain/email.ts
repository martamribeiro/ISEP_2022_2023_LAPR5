import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface EmailProps {
    email: string; 
}

export class Email extends ValueObject<EmailProps> {
    get email (): string {
        return this.props.email;
    }
    
    public constructor (props: EmailProps) {
        super(props);
    }

    public static create (email: string): Result<Email> {
        const guardResult = Guard.againstNullOrUndefined(email, 'email');
        if (!guardResult.succeeded || email.length <= 0) {
            return Result.fail<Email>(guardResult.message);
        } else {
            return Result.ok<Email>(new Email({ email: email }))
        }

    }
}