import { Injectable, Logger } from "@nestjs/common";
import * as Client from 'ssh2-sftp-client';

@Injectable()
export class SftpService{

    private logger = new Logger('sftp.service.ts');

    private sftp: Client;

    constructor() {
        this.sftp = new Client;
    }

    async connect() {
        try {
            await this.sftp.connect({
                host: '106.10.39.164',
                port: 1693,
                username: 'root',
                passphrase: '05290408jhjh@@',
            })
        } catch (error) {
            this.logger.error('SFTP 연결 오류 발생');
            this.logger.error(error);
            throw new Error('SFTP 연결 실패.');
        }
    }

    async uploadFile(localPath: string, remotePath: string) {
        try {
            await this.sftp.fastPut(localPath, remotePath);
        } catch (error) {
            this.logger.error('SFTP 파일 업로드 중 오류 발생.');
            this.logger.error(error);
            throw new Error('SFTP 파일 업로드 중 오류 발생.');
        }
    }
    
    async disconnect() {
        await this.sftp.end();
    }

}