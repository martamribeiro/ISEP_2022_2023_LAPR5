import { ValueObject } from "../core/domain/ValueObject";
import { Result } from "../core/logic/Result";
import { Guard } from "../core/logic/Guard";

interface MatriculaCamiaoProps {
    matriculaCamiao: string;
}
  
export class MatriculaCamiao extends ValueObject<MatriculaCamiaoProps> {
  get matriculaCamiao (): string {
        return this.props.matriculaCamiao;
  }
    
  public constructor (props: MatriculaCamiaoProps) {
        super(props);
  }
  
  public static create (matricula: string): Result<MatriculaCamiao> {
        const guardResult = Guard.againstNullOrUndefined(matricula, 'matricula');
        let matriculaRegEx = new RegExp('([0-9]{2}-[0-9]{2}-[A-Za-z])|([A-Za-z]{2}[ \t\r\n\v\f][0-9]{2}[ \t\r\n\v\f][A-Za-z]{2})');
        if (!guardResult.succeeded || matricula === null) {
            return Result.fail<MatriculaCamiao>(guardResult.message);
        }else if(matriculaRegEx.test(matricula)){
            return Result.fail<MatriculaCamiao>('A matrícula não é válida.');
        } else {
            return Result.ok<MatriculaCamiao>(new MatriculaCamiao({ matriculaCamiao: matricula }));
        }
  }
}