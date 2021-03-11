import React, { Dispatch, useCallback, useEffect } from "react";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { View, Text } from "react-native";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { connect } from "react-redux";
import { CombinedDataSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { CapabilitiesActions } from "../../store/actions";
import { CommonActions } from "@react-navigation/native";

interface ILoadingSelfProps {
  // store props
  _progress: number;
  _loaded: boolean;

  // self props
}

interface ILoadingProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, ILoadingSelfProps { }

const LoadingScreenContainer = React.memo(({ _progress, _loaded, navigation }: ILoadingProps) => {
  useEffect(() => {
    if (_loaded) {
      //setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            { name: MainNavigationScreenTypes.INTRO },
          ],
        })
      );
      //});
    }
  }, [_loaded]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
      <ProgressBar
        style={{ width: "100%", maxWidth: 200, marginLeft: "10%", marginRight: "10%" }}
        styleAttr="Horizontal"
        progress={_progress / 100}
        indeterminate={false}
        color={theme.themes[theme.name].loading.progressBar.trackColor}></ProgressBar>
      <Text style={{ color: theme.themes[theme.name].loading.progressBar.textColor }}>
        {
          _progress > 0
            ?
            `${_progress}%`
            :
            "loading..."
        }
      </Text>
    </View>
  );
})

const mapStateToProps = (state: IAppState, ownProps: ILoadingProps) => {
  return {
    _progress: CombinedDataSelectors.selectProgress(state),
    _loaded: CombinedDataSelectors.selectLoaded(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
  return {

  };
};

export const LoadingScreen = connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);