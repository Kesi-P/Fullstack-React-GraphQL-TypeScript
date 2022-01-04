"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220104154124 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220104154124 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "user" rename column "passsword" to "password";');
    }
}
exports.Migration20220104154124 = Migration20220104154124;
//# sourceMappingURL=Migration20220104154124.js.map