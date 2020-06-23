import { Member } from './member.model';

import { Deserializable } from '@app/interfaces/deserialize.interface';

export class Family implements Deserializable{
    name:string;
    about:string;
    uid:string;
    pic:string;
    picUrl:string;
    members:Member[];
    memberIds:string[];
    selected:boolean;

    deserialize(input: any) {
        Object.assign(this, input);
        if(!this.pic){
            this.pic = "./assets/images/family-default.png";
            this.picUrl = "./assets/images/family-default.png";
        }
        return this;
    }
}