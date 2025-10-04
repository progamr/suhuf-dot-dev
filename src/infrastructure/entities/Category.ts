import {
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Category {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Property({ unique: true })
  name!: string;

  @Property({ unique: true, index: true })
  slug!: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // Relations - removed bidirectional relationship to avoid metadata conflicts
}
