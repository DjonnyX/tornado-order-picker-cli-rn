package com.tornadoorderpicker.utils;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class LogModule extends ReactContextBaseJavaModule {

    public LogModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Log";
    }

    /**
     * Info
     */
    @ReactMethod
    public void i(String tag, String message, Promise promise) {
        Log.i("TornadoOrderPicker " + tag, message);
        promise.resolve(null);
    }
}