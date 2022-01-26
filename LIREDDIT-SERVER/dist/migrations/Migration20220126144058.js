"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220126144058 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220126144058 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "blog" add column "creators_id" int4 not null, add column "creator_id" int4 not null;');
        this.addSql('alter table "blog" add constraint "blog_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');
        this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    }
}
exports.Migration20220126144058 = Migration20220126144058;
//# sourceMappingURL=Migration20220126144058.js.map