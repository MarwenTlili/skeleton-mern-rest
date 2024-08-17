import IUser from "./user.interface";

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  getById(id: string): Promise<IUser | null>;
  findByIdentifier(identifier: string): Promise<IUser | null>;
  getAll(): Promise<IUser[]>;
  update(id: string, data: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>
}
