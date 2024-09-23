import IUser from "../interfaces/user.interface"
import User from "../models/user.model";
import { hashPassword } from "../utils/password";

const seedUsers = async () => {
  const users: Partial<IUser>[] = [
    {
      name: "admin",
      email: "admin@example.com",
      password: await hashPassword("admin"),
      roles: ["ADMIN"],
      isActive: true
    },
    {
      name: "user",
      email: "user@example.com",
      roles: ["USER"],
      password: await hashPassword("user"),
      isActive: false
    }
  ];
  try {
    console.info("seeding Users ...");
    User.insertMany(users);
    console.info("seeding Users done.");
  } catch (error) {
    console.error("Error seeding Users.", error);
  }
}

export default seedUsers;
