import { DataSource } from "typeorm";
import { Subimg } from "./entities/subimg.entity";

export const subimgRepository = [
    {
        provide: 'SUBIMG_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Subimg),
        inject: ['DATA_SOURCE'],
    }
]