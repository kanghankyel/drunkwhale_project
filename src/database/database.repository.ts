import { DataSource } from "typeorm"

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'mysql',
                host: '118.67.133.203',
                // host: 'localhost',
                port: 33060,
                username: 'gbsb',
                password: '05290408jhjh@@',
                // username: 'ganghangyeol',
                // password: 'Gks@631401',
                database: 'drunkwhale',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,      // 배포시에는 false
                logging: "all",
            });

            return dataSource.initialize();
        },
    },
];