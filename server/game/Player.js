import { Schema, type } from '@colyseus/schema';

export class Player extends Schema {
    @type("string") id;
    @type("number") x = 0;
    @type("number") y = 0;
    @type("number") score = 0;
    @type("boolean") isKnocked = false;

    constructor(id) {
        super();
        this.id = id;
    }
}
