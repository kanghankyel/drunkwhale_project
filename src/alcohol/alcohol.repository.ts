import { DataSource } from "typeorm";
import { Alcohol } from "./entities/alcohol.entity";

export const alcoholRepositroy = [
    {
        provide: 'ALCOHOL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Alcohol),
        inject: ['DATA_SOURCE'],
    }
]