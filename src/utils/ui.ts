export namespace uiutils {
    export const createShadow = (color: string | any, size: number = 1, opacity: Number = 0.41): any => {
        const shadow: any = {};

        if (color !== undefined && color !== "transparent") {
            shadow.shadowColor = color;
            shadow.shadowOffset = { width: 1, height: 1};
            shadow.shadowRadius = 7 * size;
            shadow.shadowOpacity = opacity;
        }

        return shadow;
    }
}