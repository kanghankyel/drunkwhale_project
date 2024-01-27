import { DataSource } from "typeorm";
import { Crud } from "./entities/crud.entity";

export const crudRepository = [
    {
        provide: 'CRUD_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Crud),
        inject: ['DATA_SOURCE'],
    },
];