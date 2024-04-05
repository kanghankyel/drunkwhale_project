import { DataSource } from "typeorm";
import { Worldcup } from "./entities/worldcup.entity";

export const worldcupRepository = [
    {
        provide: 'WORLDCUP_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Worldcup),
        inject: ['DATA_SOURCE'],
    }
]