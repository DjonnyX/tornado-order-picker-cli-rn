export interface IConfig {
    refServer: {
        address: string;
        updateTimeout: number;
        apiKeyTokenSalt: string;
    };
    orderServer: {
        address: string;
        updateTimeout: number;
        apiKeyTokenSalt: string;
    };
    capabilities: {
        priceDigest: number;
        checkActivityInterval: number;
    };
}