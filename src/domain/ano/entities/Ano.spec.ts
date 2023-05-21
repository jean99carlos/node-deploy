import { Ano } from "./Ano";

it("deve ter ano numerico", () => {
  const descricao = "2023a";
  expect(() => {
    Ano.create({ descricao: descricao });
  }).toThrow();
});