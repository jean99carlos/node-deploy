import { Result } from "../domain/Result";

export interface IAppMapper<T, F> {
  toEntity(raw: F): Result<T> ;
  toDTO(ano: T): Result<F>
}
