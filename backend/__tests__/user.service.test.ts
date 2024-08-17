import User from '../src/models/user.model';
import UserService from '../src/services/user.service';
import { hashPassword } from '../src/utils/password';
import CustomError from '../src/utils/CustomError';

/**
 * mocking: replace real functions, modules, or objects with simulated versions 
 * to control their behavior during tests.
 * This allows for testing units of code in isolation without relying on 
 * external dependencies or unpredictable factors.
 * why mocking: isolation, control, performance, consistency
 * types of mocking: manual mocks, automatic mocks, mock functions
 */
jest.mock('../src/models/user.model');
jest.mock('../src/utils/password');

describe('UserService', () => {
  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword123';

      (User.exists as jest.Mock).mockResolvedValueOnce(false).mockResolvedValueOnce(false);
      (hashPassword as jest.Mock).mockResolvedValueOnce(hashedPassword);
      (User.prototype.save as jest.Mock).mockResolvedValueOnce({ ...userData, password: hashedPassword });

      const result = await UserService.create(userData);

      expect(User.exists).toHaveBeenCalledWith({ name: userData.name });
      expect(User.exists).toHaveBeenCalledWith({ email: userData.email });
      expect(hashPassword).toHaveBeenCalledWith(userData.password);
      expect(result).toEqual({ ...userData, password: hashedPassword });
    });

    it('should throw error if name already exists', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

      (User.exists as jest.Mock).mockResolvedValueOnce(true);

      await expect(UserService.create(userData)).rejects.toThrow(CustomError);
      await expect(UserService.create(userData)).rejects.toHaveProperty('statusCode', 409);
    });

    it('should throw error if email already exists', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };

      (User.exists as jest.Mock).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

      await expect(UserService.create(userData)).rejects.toThrow(CustomError);
      await expect(UserService.create(userData)).rejects.toHaveProperty('statusCode', 409);
    });
  });

  // Add more tests for other methods...
});
