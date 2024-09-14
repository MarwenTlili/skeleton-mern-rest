import IUser from "../interfaces/user.interface"
import User from "../models/user.model";
import { hashPassword } from "../utils/password";

const seedUsers = async () => {
  const users: Partial<IUser>[] = [
    { name: "admin", email: "admin@example.com", password: await hashPassword("admin") },
    { name: "user", email: "user@example.com", password: await hashPassword("user") }
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
