import { Migration } from '@mikro-orm/migrations';

export class Migration20250930113845 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "category" ("id" uuid not null, "name" varchar(255) not null, "slug" varchar(255) not null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "category_pkey" primary key ("id"));`);
    this.addSql(`alter table "category" add constraint "category_name_unique" unique ("name");`);
    this.addSql(`create index "category_slug_index" on "category" ("slug");`);
    this.addSql(`alter table "category" add constraint "category_slug_unique" unique ("slug");`);

    this.addSql(`create table "source" ("id" uuid not null, "name" varchar(255) not null, "slug" varchar(255) not null, "api_identifier" varchar(255) not null, "logo_url" varchar(255) null, "is_active" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "source_pkey" primary key ("id"));`);
    this.addSql(`alter table "source" add constraint "source_name_unique" unique ("name");`);
    this.addSql(`create index "source_slug_index" on "source" ("slug");`);
    this.addSql(`alter table "source" add constraint "source_slug_unique" unique ("slug");`);
    this.addSql(`create index "source_is_active_index" on "source" ("is_active");`);

    this.addSql(`create table "author" ("id" uuid not null, "name" varchar(255) not null, "source_id" uuid not null, "external_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "author_pkey" primary key ("id"));`);
    this.addSql(`create index "author_source_id_index" on "author" ("source_id");`);
    this.addSql(`alter table "author" add constraint "author_source_id_external_id_unique" unique ("source_id", "external_id");`);

    this.addSql(`create table "article" ("id" uuid not null, "title" varchar(255) not null, "description" text not null, "url" varchar(255) not null, "image_url" varchar(255) null, "published_at" timestamptz not null, "source_id" uuid not null, "author_id" uuid null, "external_id" varchar(255) not null, "view_count" int not null default 0, "last_synced_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "article_pkey" primary key ("id"));`);
    this.addSql(`create index "article_url_index" on "article" ("url");`);
    this.addSql(`alter table "article" add constraint "article_url_unique" unique ("url");`);
    this.addSql(`create index "article_published_at_index" on "article" ("published_at");`);
    this.addSql(`create index "article_source_id_index" on "article" ("source_id");`);
    this.addSql(`create index "article_view_count_index" on "article" ("view_count");`);
    this.addSql(`alter table "article" add constraint "article_source_id_external_id_unique" unique ("source_id", "external_id");`);

    this.addSql(`create table "article_categories" ("article_id" uuid not null, "category_id" uuid not null, constraint "article_categories_pkey" primary key ("article_id", "category_id"));`);

    this.addSql(`create table "user" ("id" uuid not null, "email" varchar(255) not null, "email_verified" timestamptz null, "name" varchar(255) null, "password_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`create index "user_email_index" on "user" ("email");`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "favorite" ("id" uuid not null, "user_id" uuid not null, "article_id" uuid not null, "created_at" timestamptz not null, constraint "favorite_pkey" primary key ("id"));`);
    this.addSql(`create index "favorite_user_id_index" on "favorite" ("user_id");`);
    this.addSql(`create index "favorite_created_at_index" on "favorite" ("created_at");`);
    this.addSql(`alter table "favorite" add constraint "favorite_user_id_article_id_unique" unique ("user_id", "article_id");`);

    this.addSql(`create table "article_view" ("id" uuid not null, "article_id" uuid not null, "user_id" uuid null, "ip_hash" varchar(255) null, "created_at" timestamptz not null, constraint "article_view_pkey" primary key ("id"));`);
    this.addSql(`create index "article_view_article_id_index" on "article_view" ("article_id");`);
    this.addSql(`create index "article_view_article_id_ip_hash_index" on "article_view" ("article_id", "ip_hash");`);
    this.addSql(`create index "article_view_article_id_user_id_index" on "article_view" ("article_id", "user_id");`);

    this.addSql(`create table "user_preference" ("id" uuid not null, "user_id" uuid not null, "theme" text check ("theme" in ('light', 'dark', 'system')) not null default 'system', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_preference_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_preference" add constraint "user_preference_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "user_preference_preferred_sources" ("user_preference_id" uuid not null, "source_id" uuid not null, constraint "user_preference_preferred_sources_pkey" primary key ("user_preference_id", "source_id"));`);

    this.addSql(`create table "user_preference_preferred_categories" ("user_preference_id" uuid not null, "category_id" uuid not null, constraint "user_preference_preferred_categories_pkey" primary key ("user_preference_id", "category_id"));`);

    this.addSql(`create table "user_preference_preferred_authors" ("user_preference_id" uuid not null, "author_id" uuid not null, constraint "user_preference_preferred_authors_pkey" primary key ("user_preference_id", "author_id"));`);

    this.addSql(`create table "verification_token" ("id" uuid not null, "identifier" varchar(255) not null, "token" varchar(255) not null, "expires" timestamptz not null, "created_at" timestamptz not null, constraint "verification_token_pkey" primary key ("id"));`);
    this.addSql(`create index "verification_token_identifier_index" on "verification_token" ("identifier");`);
    this.addSql(`create index "verification_token_token_index" on "verification_token" ("token");`);
    this.addSql(`alter table "verification_token" add constraint "verification_token_token_unique" unique ("token");`);

    this.addSql(`alter table "author" add constraint "author_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;`);

    this.addSql(`alter table "article" add constraint "article_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;`);
    this.addSql(`alter table "article" add constraint "article_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "article_categories" add constraint "article_categories_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "article_categories" add constraint "article_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "favorite" add constraint "favorite_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "favorite" add constraint "favorite_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade;`);

    this.addSql(`alter table "article_view" add constraint "article_view_article_id_foreign" foreign key ("article_id") references "article" ("id") on update cascade;`);
    this.addSql(`alter table "article_view" add constraint "article_view_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_preference" add constraint "user_preference_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "user_preference_preferred_sources" add constraint "user_preference_preferred_sources_user_preference_id_foreign" foreign key ("user_preference_id") references "user_preference" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_preference_preferred_sources" add constraint "user_preference_preferred_sources_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_preference_preferred_categories" add constraint "user_preference_preferred_categories_user_preference_id_foreign" foreign key ("user_preference_id") references "user_preference" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_preference_preferred_categories" add constraint "user_preference_preferred_categories_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user_preference_preferred_authors" add constraint "user_preference_preferred_authors_user_preference_id_foreign" foreign key ("user_preference_id") references "user_preference" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "user_preference_preferred_authors" add constraint "user_preference_preferred_authors_author_id_foreign" foreign key ("author_id") references "author" ("id") on update cascade on delete cascade;`);
  }

}
