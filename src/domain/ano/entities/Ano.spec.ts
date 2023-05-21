import { Ano } from "./Ano";
describe('Ano',() => {
  it("deve criar um ano", () => {
    const descricao = "2023";
    const anos = Ano.create({ descricao: descricao });
    expect(anos.getValue()).toBeInstanceOf(Ano);
  });
  it("deve ter ano numerico", () => {
    const descricao = "2023a";
    const anos = Ano.create({ descricao: descricao });
    expect(anos.isFailure).toBeTruthy();
  });
});
