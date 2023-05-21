import { Entity } from "../../../core/domain/Entity";
import { Result } from "../../../core/domain/Result";
type PactuacaoProps = {
  descricao: string;
  programa: string;
};
export class Pactuacao extends Entity<PactuacaoProps> {
  private constructor(props: PactuacaoProps, id?: string) {
    super(props, id);
  }
  public static create(props: PactuacaoProps, id?: string) {
    if (props.descricao.length == 0) {
      return Result.fail<Pactuacao>("Descrição não deve ser vazia");
    }
    const pactuacao = new Pactuacao(props, id);
    return Result.ok<Pactuacao>(pactuacao);
  }
}
