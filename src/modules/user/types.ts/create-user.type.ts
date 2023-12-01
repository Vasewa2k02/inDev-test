import { User } from '../entities/user.entity';

export type CreateUserType = Pick<User, 'email' | 'name' | 'password'>;
