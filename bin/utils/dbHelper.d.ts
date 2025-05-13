export interface CreateDatabaseOptions {
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort: string | number;
}
export declare function createDatabase({ dbName, dbUser, dbPassword, dbHost, dbPort, }: CreateDatabaseOptions): Promise<void>;
