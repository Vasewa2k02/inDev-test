import { User } from '../entities/user.entity';

export type UserResponseType = Pick<User, 'id' | 'email' | 'name' | 'role'>;
