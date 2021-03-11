import {
    IBusinessPeriod, ICompiledOrderType, ICompiledProduct, IScenario, IScenarioPriceValue, NodeTypes, ScenarioCommonActionTypes,
    ScenarioPriceActionTypes,
    ScenarioProductActionTypes, ScenarioSelectorActionTypes
} from "@djonnyx/tornado-types";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { MenuNode } from "../menu/MenuNode";

interface IPeriodicData {
    businessPeriods: Array<IBusinessPeriod>;
    orderType: ICompiledOrderType;
}

export class ScenarioProcessing {
    static getNormalizedDownLimit(value: number): number {
        return value < 0 ? 0 : value;
    }

    static getNormalizedUpLimit(value: number): number {
        return value <= 0 ? Number.MAX_SAFE_INTEGER : value;
    }

    static setupPosition(position: IPositionWizard): void {
        const scenarios: Array<IScenario> = position.__node__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    ScenarioProcessing.setupPositionLimits(position, s);
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {
                if (!!g.positions && g.positions.length > 0) {
                    g.positions.forEach(p => {
                        ScenarioProcessing.setupPosition(p);

                        let minLimit = 0;
                        let maxLimit = Number.MAX_SAFE_INTEGER;
                        g.__node__.scenarios.forEach(s => {
                            if (s.active) {
                                // Мержинг лимитов группы
                                ScenarioProcessing.mergePositionLimitsWithGroup(p, s);

                                switch (s.action) {
                                    case ScenarioSelectorActionTypes.MIN_USAGE: {
                                        minLimit = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                                        break;
                                    }
                                    case ScenarioSelectorActionTypes.MAX_USAGE: {
                                        maxLimit = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                                        break;
                                    }
                                }
                            }
                        });

                        g.isReplacement = minLimit === 1 && maxLimit === 1;
                    });
                }
            });
        }
    }

    /**
     * Валидация состояния позиции
     */
    static validatePosition(position: IPositionWizard): boolean {
        let isPositionValid = true;
        const scenarios: Array<IScenario> = position.__node__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    switch (s.action) {
                        case ScenarioProductActionTypes.DOWN_LIMIT: {
                            const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                            const isValid = position.quantity >= normalizedValue;
                            if (!isValid) {
                                isPositionValid = false;
                            }
                            break;
                        }
                        case ScenarioProductActionTypes.UP_LIMIT: {
                            const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                            const isValid = position.quantity <= normalizedValue;
                            if (!isValid) {
                                isPositionValid = false;
                            }
                            break;
                        }
                    }
                }
            });
        }

        if (!!position.groups && position.groups.length > 0) {
            position.groups.forEach(g => {
                let isGroupValid = true;
                let isModifiersValid = true;
                if (!!g.__node__.scenarios && g.__node__.scenarios.length > 0) {
                    let groupTotalQnt: number = -1;
                    g.__node__.scenarios.forEach(s => {
                        if (s.active) {
                            switch (s.action) {
                                case ScenarioSelectorActionTypes.MIN_USAGE: {
                                    if (groupTotalQnt === -1) {
                                        groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                    }
                                    const val = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                                    /*const diff = val - groupTotalQnt;
                                    g.positions.forEach(p => {
                                        p.actualUpLimit = Math.min(diff, p.upLimit);
                                    });*/
                                    const isValid = groupTotalQnt >= val;
                                    if (!isValid) {
                                        isGroupValid = false;
                                    }
                                    break;
                                }
                                case ScenarioSelectorActionTypes.MAX_USAGE: {
                                    if (groupTotalQnt === -1) {
                                        groupTotalQnt = ScenarioProcessing.getTotalProductsQuantity(g);
                                    }
                                    const upLimit = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));

                                    const diff = (upLimit - groupTotalQnt) < 0 ? 0 : upLimit - groupTotalQnt;
                                    g.positions.forEach(p => {
                                        // динамическое обновление верхнего предела
                                        p.actualUpLimit = Math.min(p.quantity + diff, p.upLimit);
                                    });

                                    const isValid = groupTotalQnt <= upLimit;
                                    if (!isValid) {
                                        isGroupValid = false;
                                    }
                                    break;
                                }
                            }
                        }
                    });
                }

                isModifiersValid = ScenarioProcessing.isModifiersValid(g);

                // Выставляется флаг значения валидации группы продукта
                g.isValid = isGroupValid && isModifiersValid;

                if (!g.isValid) {
                    isPositionValid = false;
                }
            });
        }

        // Выставляется флаг значения валидации контейнера продукта
        position.isValid = isPositionValid;

        return position.isValid;
    }

    static normalizeTime(time?: number): number {
        const date = time !== undefined ? new Date(time) : new Date();

        const dayTime = (time !== undefined ? date.getUTCMinutes() : date.getMinutes()) * 60000
            + (time !== undefined ? date.getUTCHours() : date.getHours()) * 3600000;

        return dayTime;
    }

    static checkBusinessPeriod = (ids: Array<string> | undefined, periodicData: IPeriodicData): boolean => {
        if (!ids || !ids.length) {
            return false;
        }

        const bps = periodicData.businessPeriods.filter(bp => ids.indexOf(bp.id || "") > -1);
        const activities = new Array<boolean>();
        for (let i = 0, l1 = bps.length; i < l1; i++) {
            const bp = bps[i];

            if (!bp.active) {
                continue;
            }

            for (let j = 0, l2 = bp.schedule.length; j < l2; j++) {
                const schedule = bp.schedule[j];

                const date = new Date();
                const current = ScenarioProcessing.normalizeTime();

                const start = ScenarioProcessing.normalizeTime(schedule?.time?.start);
                const end = ScenarioProcessing.normalizeTime(schedule?.time?.end);

                const isDayChecked = !!schedule.weekDays && schedule.weekDays.indexOf(date.getDay()) > -1;
                const isTimeChecked = start <= current && current <= end;

                activities.push(!!isDayChecked && !!isTimeChecked);
            }
        }

        let result = false;
        if (activities.length > 0) {
            activities.forEach(a => {
                if (a) {
                    result = true;
                }
            });
        }

        return result;
    }

    static checkOrderTypeActivity(node: MenuNode, periodicData: IPeriodicData, dictionary: { [id: string]: MenuNode } = {}): void {
        if (dictionary[node.__rawNode__.id]) {
            return;
        }

        dictionary[node.__rawNode__.id] = node;

        ScenarioProcessing.applyCalculatedPrice(node, periodicData);

        const scenarios: Array<IScenario> = node.__rawNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (!!s.active) {
                    switch (s.action) {
                        case ScenarioCommonActionTypes.VISIBLE_BY_ORDER_TYPE: {
                            node.visibleByOrderType = (s.value as Array<string>).indexOf(periodicData.orderType.id as string) > -1;
                            break;
                        }
                    }
                }
            });
        }

        if (!!node.children && node.children.length > 0) {
            node.children.forEach(c => {
                ScenarioProcessing.checkOrderTypeActivity(c, periodicData, dictionary);
            });
        }
    }

    static getPriceValue(priceValue: IScenarioPriceValue, startValue: number): number {
        let result = startValue;

        if (priceValue.isStatic) {
            result = priceValue.value;
        } else {
            if (priceValue.isPersentage) {
                result = result + result * priceValue.value * 0.01;
            } else {
                result += priceValue.value;
            }
        }

        return result;
    }

    static applyCalculatedPrice(node: MenuNode<ICompiledProduct>, periodicData: IPeriodicData): void {
        if (node.__rawNode__.type !== NodeTypes.PRODUCT) {
            return;
        }

        let result = !!node.__rawNode__.content.prices && !!node.__rawNode__.content.prices[node.currency.id as string]
            ? node.__rawNode__.content.prices[node.currency.id as string].value
            : 0;

        const scenarios: Array<IScenario> = node.__rawNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                const priceVal = s.value as IScenarioPriceValue;
                if (s.active) {
                    switch (s.action) {
                        case ScenarioPriceActionTypes.PRICE: {
                            result = ScenarioProcessing.getPriceValue(priceVal, result);
                            break;
                        }
                        case ScenarioPriceActionTypes.PRICE_BY_BUSINESS_PERIOD: {
                            if (ScenarioProcessing.checkBusinessPeriod(priceVal.entities, periodicData)) {
                                result = ScenarioProcessing.getPriceValue(priceVal, result);
                            }
                            break;
                        }
                        case ScenarioPriceActionTypes.PRICE_BY_ORDER_TYPE: {
                            if (priceVal.entities !== undefined && priceVal.entities.length > 0) {
                                const allow = (priceVal.entities as Array<string>).indexOf(periodicData.orderType.id) > -1;
                                if (allow) {
                                    result = ScenarioProcessing.getPriceValue(priceVal, result);
                                }
                            }
                            break;
                        }
                    }
                }
            });
        }

        node.price = result;
    }

    /**
     * Применение периодичных сценариев 
     */
    static applyPeriodicScenariosForNode(node: MenuNode, periodicData: IPeriodicData, dictionary: { [id: string]: MenuNode } = {}): void {
        if (dictionary[node.__rawNode__.id]) {
            return;
        }

        dictionary[node.__rawNode__.id] = node;

        // Расчет цены с учетом сценариев
        ScenarioProcessing.applyCalculatedPrice(node, periodicData);

        const scenarios: Array<IScenario> = node.__rawNode__.scenarios;
        if (!!scenarios && scenarios.length > 0) {
            scenarios.forEach(s => {
                if (s.active) {
                    switch (s.action) {
                        case ScenarioCommonActionTypes.VISIBLE_BY_BUSINESS_PERIOD: {
                            const isActive = ScenarioProcessing.checkBusinessPeriod(s.value as Array<string>, periodicData);
                            node.visibleByBusinessPeriod = isActive;
                            break;
                        }
                    }
                }
            });
        }

        if (!!node.children && node.children.length > 0) {
            node.children.forEach(c => {
                ScenarioProcessing.applyPeriodicScenariosForNode(c, periodicData, dictionary);
            });
        }
    }

    private static setupPositionLimits(p: IPositionWizard, s: IScenario): void {
        if (s.active) {
            switch (s.action) {
                case ScenarioProductActionTypes.DOWN_LIMIT: {
                    const normalizedValue = ScenarioProcessing.getNormalizedDownLimit(parseInt(s.value as any));
                    p.downLimit = normalizedValue;

                    // Выставляется дефолтовое минимальное количество,
                    // которое нельзя уменьшать. Это формирование позиции
                    // с предустановленным выбором
                    p.quantity = p.downLimit;
                    break;
                }
                case ScenarioProductActionTypes.UP_LIMIT: {
                    const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                    p.upLimit = normalizedValue;
                    break;
                }
            }
        }
    }

    /**
     * Мержинг пределов
     * Мержится только верхний предел
     */
    private static mergePositionLimitsWithGroup(p: IPositionWizard, s: IScenario): void {
        if (s.active) {
            switch (s.action) {
                case ScenarioSelectorActionTypes.MIN_USAGE: {
                    // p.downLimit = Math.max(p.downLimit, normalizedValue);
                    break;
                }
                case ScenarioSelectorActionTypes.MAX_USAGE: {
                    const normalizedValue = ScenarioProcessing.getNormalizedUpLimit(parseInt(s.value as any));
                    p.upLimit = Math.min(p.upLimit, normalizedValue);
                    break;
                }
            }
        }
    }

    private static isModifiersValid(group: IPositionWizardGroup): boolean {
        let result = true;
        for (let i = 0, l = group.positions.length; i < l; i++) {
            const p = group.positions[i];
            if (p.quantity > 0) {
                const isModifierValid = ScenarioProcessing.validatePosition(p);
                if (!isModifierValid) {
                    result = false;
                }
                p.isValid = isModifierValid;
            } else {
                p.isValid = true;
            }
        }

        return result;
    }

    private static getTotalProductsQuantity(group: IPositionWizardGroup): number {
        let result = 0;

        if (!!group.positions && group.positions.length > 0) {
            group.positions.forEach(p => {
                result += p.quantity;
            })
        }

        return result;
    }
}