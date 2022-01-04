import { Migration } from '@mikro-orm/migrations';

export class Migration20220104154124 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" rename column "passsword" to "password";');
  }

}
