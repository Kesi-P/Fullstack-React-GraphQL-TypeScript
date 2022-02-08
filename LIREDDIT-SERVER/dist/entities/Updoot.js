"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updoot = void 0;
const core_1 = require("@mikro-orm/core");
const type_graphql_1 = require("type-graphql");
const Blog_1 = require("./Blog");
const User_1 = require("./User");
let Updoot = class Updoot {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Updoot.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User),
    (0, core_1.ManyToOne)({ entity: () => User_1.User }),
    __metadata("design:type", User_1.User)
], Updoot.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Blog_1.Blog),
    (0, core_1.ManyToOne)({ entity: () => Blog_1.Blog }),
    __metadata("design:type", Blog_1.Blog)
], Updoot.prototype, "blog", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, core_1.Property)({ type: "int" }),
    __metadata("design:type", Number)
], Updoot.prototype, "value", void 0);
Updoot = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, core_1.Entity)()
], Updoot);
exports.Updoot = Updoot;
//# sourceMappingURL=Updoot.js.map