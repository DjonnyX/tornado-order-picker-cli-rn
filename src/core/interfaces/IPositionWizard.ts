import { ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { MenuNode } from "../menu/MenuNode";

export interface IPositionWizard extends EventEmitter {
    readonly id: number;
    readonly type: PositionWizardTypes;
    readonly stateId: number;
    readonly rests: number;
    readonly availableQuantitiy: number;
    readonly mode: PositionWizardModes;
    readonly __product__: ICompiledProduct | null;
    readonly __node__: MenuNode<ICompiledProduct>;
    readonly currency: ICurrency;
    readonly nestedPositions: Array<IPositionWizard>;
    readonly groups: Array<IPositionWizardGroup>;
    readonly allGroups: Array<IPositionWizardGroup>;
    readonly price: number;
    readonly sum: number;
    readonly discount: number;
    readonly discountPerOne: number;
    readonly discountSum: number;
    isReplacement: boolean;
    active: boolean;
    actualUpLimit: number;
    upLimit: number;
    downLimit: number;
    isValid: boolean;
    currentGroup: number;
    quantity: number;
    updateState: () => void;
    edit: () => boolean;
    getFormatedPrice: (withCurrency?: boolean) => string;
    getFormatedSum: (withCurrency?: boolean) => string;
    getFormatedSumPerOne: (withCurrency?: boolean) => string;
    getFormatedDiscount: (withCurrency?: boolean) => string;
    getFormatedDiscountSum: (withCurrency?: boolean) => string;
    getFormatedDiscountPerOne: (withCurrency?: boolean) => string;
    dispose: () => void;
}

export interface IPositionWizardGroup extends EventEmitter {
    readonly index: number;
    readonly currency: ICurrency;
    readonly positions: Array<IPositionWizard>;
    readonly allPositions: Array<IPositionWizard>;
    readonly __node__: MenuNode<ICompiledSelector>;
    readonly sum: number;
    readonly discount: number;
    isReplacement: boolean;
    active: boolean;
    isValid: boolean;
    getFormatedSum: (withCurrency?: boolean) => string;
    dispose: () => void;
}