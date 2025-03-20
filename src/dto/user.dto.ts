import { ResponseTokenDTO } from "./token.dto";

export interface CreateUserDTO {
   firstName: string;
    lastName: string;
    email: string;
    password: string;
    avatar: string;
    phone: string;
    address: string;
}


export interface ResponseUserDTO {
    id : string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    role: string;
    phone: string;
    address: string;
    tokens : ResponseTokenDTO;
}
