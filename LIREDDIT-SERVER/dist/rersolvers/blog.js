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
const isAuth_1 = require("../middleware/isAuth");
const core_1 = require("@mikro-orm/core");
let BlogInput = class BlogInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlogInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlogInput.prototype, "content", void 0);
BlogInput = __decorate([
    (0, type_graphql_1.InputType)()
], BlogInput);
let PaginatedBlog = class PaginatedBlog {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Blog_1.Blog]),
    __metadata("design:type", Array)
], PaginatedBlog.prototype, "blogs", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PaginatedBlog.prototype, "hasMore", void 0);
PaginatedBlog = __decorate([
    (0, type_graphql_1.ObjectType)()
], PaginatedBlog);
let BlogResolver = class BlogResolver {
    textSnippet(root) {
        return root.content.slice(0, 50);
    }
    async blogs(limit, cursor, { em }) {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const blogs = em.createQueryBuilder(Blog_1.Blog);
        blogs.select('*')
            .orderBy({ createdAt: core_1.QueryOrder.ASC });
        if (cursor) {
            blogs.where({ createdAt: { $gt: new Date(parseInt(cursor)) } });
        }
        const knex = blogs.getKnexQuery();
        const res = await em.getConnection().execute(knex);
        const entities = res.map(a => em.map(Blog_1.Blog, a));
        return { blogs: entities.slice(0, realLimit), hasMore: entities.length === realLimitPlusOne };
    }
    blog(id, { em }) {
        return em.findOne(Blog_1.Blog, { id });
    }
    async createBlog(input, { em, req }) {
        console.log(req.session.userId);
        if (!req.session.userId) {
            throw new Error('Please log in');
        }
        const blog = em.create(Blog_1.Blog, Object.assign(Object.assign({}, input), { creator: req.session.userId }));
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
    (0, type_graphql_1.FieldResolver)(() => String),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Blog_1.Blog]),
    __metadata("design:returntype", void 0)
], BlogResolver.prototype, "textSnippet", null);
__decorate([
    (0, type_graphql_1.Query)(() => PaginatedBlog),
    __param(0, (0, type_graphql_1.Arg)("limit", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)('cursor', () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
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
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BlogInput, Object]),
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
    (0, type_graphql_1.Resolver)(Blog_1.Blog)
], BlogResolver);
exports.BlogResolver = BlogResolver;
//# sourceMappingURL=blog.js.map