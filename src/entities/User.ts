import { Entity, Property, PrimaryKey } from "@mikro-orm/core/decorators";

@Entity()
export class User {

    @PrimaryKey()
    id!: ObjectId;

}