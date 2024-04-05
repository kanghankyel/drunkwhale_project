import { DataSource } from "typeorm";
import { Subscribe } from "./entities/subscribe.entity";

export const subscribeRepository = [
    {
        provide: 'SUBSCRIBE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Subscribe),
        inject: ['DATA_SOURCE'],
    }
]