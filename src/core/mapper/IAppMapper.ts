export interface IAppMapper<T, F> {
  toEntity(raw: F): T;
  toDTO(ano: T): F;
}
