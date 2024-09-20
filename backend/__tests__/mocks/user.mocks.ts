import IUser from "../../src/interfaces/user.interface";
import { ObjectId } from 'mongodb';

export const mockAdminUser: Partial<IUser> = {
  // id: new ObjectId().toString(),
  name: 'admin',
  email: 'admin@example.com',
  password: 'hashedpassword123',
  roles: ['ADMIN'],
  isActive: true
};

export const mockUser = {
  id: new ObjectId().toString(),
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: 'hashedpassword123',
  roles: ['USER'],
  isActive: true
};

export const mockUsers: Partial<IUser>[] = [
  {
    id: new ObjectId().toString(),
    name: 'admin',
    email: 'admin@example.com',
    password: 'hashedpassword123',
    roles: ['ADMIN'],
    isActive: true
  },
  {
    id: new ObjectId().toString(),
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'hashedpassword123',
    roles: ['USER'],
    isActive: false
  },
  {
    id: new ObjectId().toString(),
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    password: 'hashedpassword456',
    roles: ['USER'],
    isActive: true
  },
  {
    id: new ObjectId().toString(),
    name: 'Alice Johnson',
    email: 'alicej@example.com',
    password: 'hashedpassword789',
    roles: ['USER'],
    isActive: false
  },
];
