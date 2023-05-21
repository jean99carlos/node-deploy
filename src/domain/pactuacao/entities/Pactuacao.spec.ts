import { Pactuacao } from "./Pactuacao";

describe("Pactuação", () => {
  it("Deve criar um objeto válido", () => {
    const pactuacao = Pactuacao.create({
      descricao: "Pronatec 2023/1",
      programa: "PRONATEC",
    });
    expect(pactuacao.isSuccess).toBeTruthy();
    expect(pactuacao.getValue()).toBeInstanceOf(Pactuacao);
    expect(pactuacao.getValue().props.descricao).toBe("Pronatec 2023/1");
    expect(pactuacao.getValue().props.programa).toBe("PRONATEC");
  });
  it("não deve permitir descrição vazia", () => {
    const pactuacao = Pactuacao.create({ descricao: "", programa: "" });
    expect(pactuacao.isFailure).toBeTruthy();
  });
});
