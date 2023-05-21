import { Result } from "../domain/Result";

export interface IDomainMapper<T, F> {
  toDomain(raw: F): Result<T>;
  toPersistence(ano: T): Result<F>;
}
