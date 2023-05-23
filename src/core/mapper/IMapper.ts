import { Result } from "../domain/Result";

export interface IMapper<T,F> {
  toDTO(object:T):Result<F>
  toDomain(raw: any): Result<T>;
  toPersistence(object: T): Result<any>;
}
