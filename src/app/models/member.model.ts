import { Family } from './family.model';
import { Deserializable } from '@app/interfaces/deserialize.interface';

export class Member implements Deserializable{
    pic:string;
    picUrl:string;
    firstName:string;
    lastName:string;
    phone:string;
    email:string;
    dob:string;
    uid:string;
    familyIds:string[] = [];
    families:Family[] = [];
    favourites:string[] = [];
    selected:boolean;

    deserialize(input: any) {
        Object.assign(this, input);
        if(!this.pic){
            this.pic = "./assets/images/member-default.png";
            this.picUrl = "./assets/images/member-default.png";
        }
        return this;
    }
}