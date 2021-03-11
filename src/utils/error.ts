export const extractError = (error: Array<{ code: number | string, message: string }>): string | undefined => {
    if (!!error && error.length > 0) {
        let err = "";

        error.forEach(e => {
            err += `${e.message} (${e.code})\n`
        });

        return err;
    }

    return undefined;
}