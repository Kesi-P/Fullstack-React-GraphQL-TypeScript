import { Migration } from '@mikro-orm/migrations';

export class Migration20220103135049 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "blog" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');

    this.addSql('drop table if exists "post" cascade;');

    this.addSql('drop table if exists "user" cascade;');
  }

}
