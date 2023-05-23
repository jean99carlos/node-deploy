import { z } from "zod";

export class AnoDTO {
  public id?: string;
  public descricao: string;
  private static schema = z.object({
    id: z.string().optional(),
    descricao: z.string(),
  });
  constructor(data: any) {
    const validateData = AnoDTO.schema.parse(data);
    this.id = validateData.id;
    this.descricao = validateData.descricao;
  }
}

