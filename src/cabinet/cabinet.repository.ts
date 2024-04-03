import { DataSource } from "typeorm";
import { Cabinet } from "./entities/cabinet.entity";

export const cabinetRepositroy = [
    {
        provide: 'CABINET_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cabinet),
        inject: ['DATA_SOURCE'],
    }
]