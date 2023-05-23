import { z } from "zod";

export class PactuacaoDTO {
  public id?: string;
  public descricao: string;
  public programa: string;
  private static schema = z.object({
    id: z.string().optional(),
    descricao: z.string(),
    programa: z.string(),
  });
  constructor(data: any) {
    const validateData = PactuacaoDTO.schema.parse(data);
    this.id = validateData.id;
    this.programa = validateData.programa;
    this.descricao = validateData.descricao;
  }
}
