import { DataSource } from "typeorm";
import { Dog } from "./entities/dog.entity";

export const dogRepositroy = [
    {
        provide: 'DOG_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Dog),
        inject: ['DATA_SOURCE'],
    }
]