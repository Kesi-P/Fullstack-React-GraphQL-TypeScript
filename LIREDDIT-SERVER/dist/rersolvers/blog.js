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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogResolver = void 0;
const Blog_1 = require("../entities/Blog");
const type_graphql_1 = require("type-graphql");
let BlogResolver = class BlogResolver {
    blogs({ em }) {
        return em.find(Blog_1.Blog, {});
    }
    blog(id, { em }) {
        return em.findOne(Blog_1.Blog, { id });
    }
    async createBlog(title, { em }) {
        const blog = em.create(Blog_1.Blog, { title });
        await em.persistAndFlush(blog);
        return blog;
    }
    async updateBlog(id, title, { em }) {
        const blog = await em.findOne(Blog_1.Blog, { id });
        if (!blog) {
            return null;
        }
        if (typeof title !== 'undefined') {
            blog.title = title;
            await em.persistAndFlush(blog);
        }
        return blog;
    }
    async deleteBlog(id, { em }) {
        await em.nativeDelete(Blog_1.Blog, { id });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Blog_1.Blog]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "blogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => Blog_1.Blog, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('idinput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "blog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Blog_1.Blog),
    __param(0, (0, type_graphql_1.Arg)('titleinput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "createBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Blog_1.Blog),
    __param(0, (0, type_graphql_1.Arg)('inputid')),
    __param(1, (0, type_graphql_1.Arg)('titleinput', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "updateBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('inputid')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BlogResolver.prototype, "deleteBlog", null);
BlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlogResolver);
exports.BlogResolver = BlogResolver;
//# sourceMappingURL=blog.js.map