import { DataSource } from "typeorm";
import { Weekbottle } from "./entities/weekbottle.entity";

export const weekbottleRepository = [
    {
        provide: 'WEEKBOTTLE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Weekbottle),
        inject: ['DATA_SOURCE'],
    }
]