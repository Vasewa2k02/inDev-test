import { AbstractEntity } from 'src/modules/database/abstract.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Session extends AbstractEntity<Session> {
  @Column()
  refreshToken: string;

  @OneToOne(() => User, (user) => user.session)
  user: User;
}
