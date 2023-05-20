export interface IService<T> {
    get(): Promise<T[]|undefined>;
    getById(id:string): Promise<T|undefined>;
    create(param: T): Promise<T>;
    update(param: T): Promise<T>;
    delete(param: T): Promise<void>;
}
