import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';

import { Session } from 'src/modules/session/entities/session.entity';
import { Role } from 'src/common/enums/role.enum';
import { AbstractEntity } from 'src/modules/database/abstract.entity';

@Entity()
@Unique(['email'])
export class User extends AbstractEntity<User> {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.user })
  role: Role;

  @OneToOne(() => Session, { cascade: true, eager: true })
  @JoinColumn()
  session: Session;
}
