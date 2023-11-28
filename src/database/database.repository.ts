import { DataSource } from "typeorm"

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: '118.67.133.203',
                // host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '05290408jhjh@@',
                // username: 'ganghangyeol',
                // password: 'Gks@631401',
                database: 'doggo',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: "all",
            });

            return dataSource.initialize();
        },
    },
];