import { Migration } from '@mikro-orm/migrations';

export class Migration20251001021428 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "article" alter column "url" type text using ("url"::text);`);
    this.addSql(`alter table "article" alter column "image_url" type text using ("image_url"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "article" alter column "url" type varchar(255) using ("url"::varchar(255));`);
    this.addSql(`alter table "article" alter column "image_url" type varchar(255) using ("image_url"::varchar(255));`);
  }

}
