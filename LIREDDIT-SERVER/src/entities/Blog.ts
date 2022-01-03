// Mikro-Orm Classes and Decorators
// Create column into the DB

import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Blog {
    @PrimaryKey()
    id!: number;

    @Property({ type: "date"})
    createdAt = new Date();

    @Property({ type: "date" ,onUpdate: () => new Date( )})
    updatedAt = new Date();

    @Property({ type: "text"})
    title!: string;
}