import React, { Dispatch, useCallback, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CapabilitiesSelectors, CombinedDataSelectors } from "../../store/selectors";
import { CommonActions } from "@react-navigation/native";
import { IOrderPickerTheme } from "@djonnyx/tornado-types";

interface ILoadingSelfProps {
  // store props
  _theme: IOrderPickerTheme;
  _progress: number;
  _loaded: boolean;

  // self props
}

interface ILoadingProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, ILoadingSelfProps { }

const LoadingScreenContainer = React.memo(({ _theme, _progress, _loaded, navigation }: ILoadingProps) => {
  useEffect(() => {
    if (_loaded) {
      //setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            { name: MainNavigationScreenTypes.ORDERS },
          ],
        })
      );
      //});
    }
  }, [_loaded]);

  const theme = _theme?.themes?.[_theme?.name];

  return (
    <>
      {
        !!theme &&
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.loading.backgroundColor }}>
          <ProgressBar
            style={{ width: "100%", maxWidth: 200, marginLeft: "10%", marginRight: "10%" }}
            styleAttr="Horizontal"
            progress={_progress / 100}
            indeterminate={_progress === 100 || _progress === 0}
            color={theme.loading.progressBar.trackColor}></ProgressBar>
          <Text style={{ color: theme.loading.progressBar.textColor, fontSize: theme.loading.progressBar.textFontSize }}>
            {
              _progress > 0
                ?
                `${_progress}%`
                :
                "loading..."
            }
          </Text>
        </View>
      }
    </>
  );
})

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  return {
    _theme: CapabilitiesSelectors.selectTheme(state),
    _progress: CombinedDataSelectors.selectProgress(state),
    _loaded: CombinedDataSelectors.selectLoaded(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
  return {

  };
};

export const LoadingScreen = connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);