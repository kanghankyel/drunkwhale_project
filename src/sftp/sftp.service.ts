import { Injectable, Logger } from "@nestjs/common";
import * as Client from 'ssh2-sftp-client';
import * as fs from 'fs';

@Injectable()
export class SftpService{

    private logger = new Logger('sftp.service.ts');

    private sftp: Client;

    constructor() {
        this.sftp = new Client;
    }

    // SFTP 연결 + 연결정보
    async connect() {
        try {
            await this.sftp.connect({
                host: '106.10.39.164',
                port: 1693,
                username: 'root',
                password: '05290408jhjh@@',
            })
            this.logger.debug('SFTP 연결 성공');
        } catch (error) {
            this.logger.error('SFTP 연결 오류 발생');
            this.logger.error(error);
            console.log(error);
            throw new Error('SFTP 연결 실패.');
        }
    }

    // SFTP 서버 디렉토리 확인
    async checkDirectory(remotePath: string) {
        try {
            const directoryPath = remotePath.split('/').slice(0, -1).join('/');
            const dirExists = await this.sftp.exists(directoryPath);
            if (!dirExists) {
                this.logger.debug(`${directoryPath} 디렉토리가 존재하지 않아 새로 생성합니다.`);
                await this.sftp.mkdir(directoryPath, true);
            }
            // return dirExists;
            return true;
        } catch (error) {
            throw new Error(`디렉토리 확인에 실패하였습니다. 에러내용 : ${error}`);
        }
    }
    
    // SFTP 연결종료
    async disconnect() {
        await this.sftp.end();
    }

    // SFTP 파일업로드
    async uploadFileFromBuffer(buffer: Buffer, destination: string) {
        try {
            await this.connect();
            const dirExists = await this.checkDirectory(destination);
            if (!dirExists) {
                throw new Error('해당 디렉토리가 존재하지 않습니다.');
            }
            await this.sftp.put(buffer, destination);
        } catch (error) {
            this.logger.error('SFTP 파일 업로드 중 오류 발생.');
            this.logger.error(error);
            throw error;
        } finally {
            this.disconnect();
        }
    }

}