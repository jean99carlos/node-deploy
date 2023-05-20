import { Entity } from "../../../core/domain/Entity";
type AnoProps = {
  descricao: string;
};
export class Ano extends Entity<AnoProps> {
  private constructor(props: AnoProps, id?: string) {
    super(props, id);
  }
  public static create(props: AnoProps, id?: string) {
    const ano = new Ano(props, id);
    return ano;
  }
}
