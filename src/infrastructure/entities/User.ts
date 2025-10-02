import {
  Entity,
  PrimaryKey,
  Property,
  OneToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true, index: true })
  email!: string;

  @Property({ nullable: true })
  emailVerified?: Date;

  @Property({ nullable: true })
  name?: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @Property({ onCreate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), defaultRaw: 'CURRENT_TIMESTAMP' })
  updatedAt: Date = new Date();

  // Relations
  @OneToOne('UserPreference', 'user', { nullable: true })
  preference?: any;

  @OneToMany('Favorite', 'user')
  favorites = new Collection<any>(this);

  @OneToMany('ArticleView', 'user')
  views = new Collection<any>(this);
}
