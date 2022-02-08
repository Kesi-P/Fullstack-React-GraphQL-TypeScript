import { Migration } from '@mikro-orm/migrations';

export class Migration20220208150930 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "updoot" ("id" serial primary key, "user_id" int4 not null, "blog_id" int4 not null, "value" jsonb not null);');

    this.addSql('alter table "updoot" add constraint "updoot_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "updoot" add constraint "updoot_blog_id_foreign" foreign key ("blog_id") references "blog" ("id") on update cascade;');
  }

}
