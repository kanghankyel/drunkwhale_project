import { DataSource } from "typeorm";
import { Admin } from "./entities/admin.entity";

export const adminRepository = [
    {
        provide: 'ADMIN_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Admin),
        inject: ['DATA_SOURCE'],
    }
]