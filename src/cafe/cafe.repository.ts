import { DataSource } from "typeorm";
import { Cafe } from "./entities/cafe.entity";

export const cafeRepository = [
    {
        provide: 'CAFE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cafe),
        inject: ['DATA_SOURCE'],
    },
];