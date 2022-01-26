"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220126144203 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220126144203 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "blog" add column "creator_id" int4 not null;');
        this.addSql('alter table "blog" add constraint "blog_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;');
    }
}
exports.Migration20220126144203 = Migration20220126144203;
//# sourceMappingURL=Migration20220126144203.js.map