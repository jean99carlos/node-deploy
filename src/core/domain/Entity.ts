import crypto from "crypto"
export interface WithId{
   id: string;
}
export class Entity<T> implements WithId{
  public id: string;
  public props: T;
  constructor(props: T, id?: string) {
    this.props = props;
    this.id = id ?? crypto.randomUUID();
  }
}
