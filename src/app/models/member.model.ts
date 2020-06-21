import { Family } from './family.model';
import { Deserializable } from '@app/interfaces/deserialize.interface';

export class Member implements Deserializable{
    pic:string;
    firstName:string;
    lastName:string;
    phone:string;
    email:string;
    dob:string;
    uid:string;
    familyIds:string[];
    families:Family[];

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}