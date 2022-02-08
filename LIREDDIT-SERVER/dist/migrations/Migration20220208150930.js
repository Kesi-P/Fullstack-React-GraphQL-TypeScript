"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220208150930 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220208150930 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "updoot" ("id" serial primary key, "user_id" int4 not null, "blog_id" int4 not null, "value" jsonb not null);');
        this.addSql('alter table "updoot" add constraint "updoot_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
        this.addSql('alter table "updoot" add constraint "updoot_blog_id_foreign" foreign key ("blog_id") references "blog" ("id") on update cascade;');
    }
}
exports.Migration20220208150930 = Migration20220208150930;
//# sourceMappingURL=Migration20220208150930.js.map