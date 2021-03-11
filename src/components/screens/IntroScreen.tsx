import React, { Dispatch, useCallback, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MenuSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads } from "../simple";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import { OrderWizard } from "../../core/order/OrderWizard";

interface IIntroSelfProps {
    // store props
    _menuStateId: number;
    _intros: Array<ICompiledAd>;
    _language: ICompiledLanguage;

    // self props
}

interface IIntroProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IIntroSelfProps { }

const IntroScreenContainer = React.memo(({ _language, _intros, _menuStateId, navigation }: IIntroProps) => {
    const pressHandler = useCallback((ad: ICompiledAd) => {
        OrderWizard.current.new();
    }, []);

    return (
        <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <Ads ads={_intros} menuStateId={_menuStateId} language={_language} onPress={pressHandler} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IIntroProps) => {
    return {
        _intros: CombinedDataSelectors.selectIntros(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const IntroScreen = connect(mapStateToProps, mapDispatchToProps)(IntroScreenContainer);