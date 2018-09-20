import { ID } from "@datorama/akita";

export class Authentication {
    constructor(public id: ID, public tokenId: string, public accessToken: string) { }
}
