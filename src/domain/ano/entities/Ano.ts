import { Entity } from "../../../core/domain/Entity";
import { Result } from "../../../core/domain/Result";
type AnoProps = {
  descricao: string;
};
export class Ano extends Entity<AnoProps> {
  private constructor(props: AnoProps, id?: string) {
    super(props, id);
  }
  public static create(props: AnoProps, id?: string) {
    try{
      Number.parseInt(props.descricao)
    }catch(ex){
      return Result.fail<Ano>('Descrição deve ser número')
    }
    if(props.descricao.length!=4){
      return Result.fail<Ano>('Ano deve ter 4 dígitos')
    }
    const ano = new Ano(props, id);
    return Result.ok<Ano>(ano);
  }
}
