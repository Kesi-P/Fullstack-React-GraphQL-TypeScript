"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220103135049 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220103135049 extends migrations_1.Migration {
    async up() {
        this.addSql('create table "blog" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null);');
        this.addSql('drop table if exists "post" cascade;');
        this.addSql('drop table if exists "user" cascade;');
    }
}
exports.Migration20220103135049 = Migration20220103135049;
//# sourceMappingURL=Migration20220103135049.js.map