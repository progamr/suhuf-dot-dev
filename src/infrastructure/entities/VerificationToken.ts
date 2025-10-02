import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class VerificationToken {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ index: true })
  identifier!: string; // email

  @Property({ unique: true, index: true })
  token!: string;

  @Property()
  expires!: Date;

  @Property()
  createdAt: Date = new Date();
}
