import { faker } from "@faker-js/faker";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";


export const newFakeUser = (): CreateUserDto => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const pattern =
        /^(?=.*[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-zñÑáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛ\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    const fakeUser: CreateUserDto = {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        password: faker.internet.password({ length: 10, pattern }),
        phone: faker.phone.number(),
    };
    return fakeUser;
};