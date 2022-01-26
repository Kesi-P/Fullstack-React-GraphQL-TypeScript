import { Migration } from '@mikro-orm/migrations';

export class Migration20220126144203 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "blog" add column "creator_id" int4 not null;');

    this.addSql('alter table "blog" add constraint "blog_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');
  }

}
