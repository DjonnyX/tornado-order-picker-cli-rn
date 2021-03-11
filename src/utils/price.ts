import { config } from "../Config"

export const priceFormatter = (value: number) => {
    return (value * 0.01).toFixed(config.capabilities.priceDigest);
}