import { Member } from './member.model';

import { Deserializable } from '@app/interfaces/deserialize.interface';

export class Family implements Deserializable{
    name:string;
    about:string;
    uid:string;
    pic:string;
    members:Member[];
    memberIds:string[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}