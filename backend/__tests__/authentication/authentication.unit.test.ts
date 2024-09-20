import bcrypt from 'bcryptjs'
import User from '../../src/models/user.model'
import userService from '../../src/services/user.service'
import { AuthService } from '../../src/services/auth.service'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../../src/utils/jwt.util'

jest.mock('bcryptjs')
jest.mock('../../src/models/user.model')
jest.mock('../../src/services/user.service')
jest.mock('../../src/utils/jwt.util')

describe('AuthService - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return access and refresh tokens when login is successful', async () => {
      const mockUser = { id: 'userId', password: 'hashedPassword', save: jest.fn() };
      (userService.findByIdentifier as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');

      const result = await AuthService.login('identifier', 'password')

      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' })
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('should throw an error if the user is not found', async () => {
      (userService.findByIdentifier as jest.Mock).mockResolvedValue(null);
      await expect(AuthService.login('identifier', 'password')).rejects.toThrow('Invalid identifier or password');
    })

    it('should throw an error if the password is incorrect', async () => {
      const mockUser = { id: 'userId', password: 'hashedPassword' };
      (userService.findByIdentifier as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(AuthService.login('identifier', 'password')).rejects.toThrow('Invalid identifier or password')
    })
  })

  describe('register', () => {
    it('should return tokens when registration is successful', async () => {
      const mockUser = { id: 'userId', save: jest.fn().mockResolvedValue({ id: 'userId', toObject: () => ({}) }) };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.exists as jest.Mock).mockResolvedValue(false);
      (User as any).mockReturnValue(mockUser);
      (generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');

      const result = await AuthService.register(new User({
        name: 'name',
        email: 'email',
        password: 'password',
        roles: ['USER'],
        isActive: false
      }))

      expect(result).toEqual({ accessToken: 'accessToken', refreshToken: 'refreshToken' })
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('should throw an error if the name already exists', async () => {
      (User.exists as jest.Mock).mockResolvedValue(true);

      await expect(AuthService.register(new User({
        name: 'name',
        email: 'email',
        password: 'password',
        roles: ['USER'],
        isActive: false
      }))).rejects.toThrow('Name already exists')
    })
  })

  describe('refreshTokens', () => {
    it('should return new tokens when refresh is successful', async () => {
      const mockUser = { id: 'userId', refreshToken: 'oldRefreshToken', save: jest.fn() };
      (verifyRefreshToken as jest.Mock).mockReturnValue({ id: 'userId' });
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (generateAccessToken as jest.Mock).mockReturnValue('newAccessToken');
      (generateRefreshToken as jest.Mock).mockReturnValue('newRefreshToken');

      const result = await AuthService.refreshTokens('oldRefreshToken');

      expect(result).toEqual({ accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' })
      expect(mockUser.save).toHaveBeenCalled()
    })

    it('should throw an error if the refresh token is invalid', async () => {
      (verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid refresh token')
      })

      await expect(AuthService.refreshTokens('invalidRefreshToken')).rejects.toThrow('Failed to refresh tokens')
    })
  })
})
