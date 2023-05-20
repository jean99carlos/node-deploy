export interface IDomainMapper<T, F> {
  toDomain(raw: F): T;
  toPersistence(ano: T): F;
}
