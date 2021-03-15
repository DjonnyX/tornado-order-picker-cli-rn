package com.tornadoorderpicker;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Rect;
import android.media.AudioManager;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.TypedValue;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;

import com.facebook.react.ReactActivity;

interface OnKeyboardVisibilityListener {
    void onVisibilityChanged(boolean visible);
}

public class MainActivity extends ReactActivity implements OnKeyboardVisibilityListener {

    String packageName;
    ComponentName mAdminComponentName;
    DevicePolicyManager mDevicePolicyManager;

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void setKioskMode() {
        packageName = this.getPackageName();
        mDevicePolicyManager = (DevicePolicyManager) getSystemService(Context.DEVICE_POLICY_SERVICE);
        mAdminComponentName = new ComponentName(this, TornadoDeviceAdminReceiver.class);

        hideSystemUI();
        setLockTask();
        setAppAsDefault();
        setVolumeToMax();
        setDisableKeyguard();
        setKeepScreenOn();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setKioskMode();

        setKeyboardVisibilityListener(this);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onResume() {
        super.onResume();

        setKioskMode();
    }

    private void setKeyboardVisibilityListener(final OnKeyboardVisibilityListener onKeyboardVisibilityListener) {
        final View parentView = ((ViewGroup) findViewById(android.R.id.content)).getChildAt(0);
        parentView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {

            private boolean alreadyOpen;
            private final int defaultKeyboardHeightDP = 100;
            private final int EstimatedKeyboardDP = defaultKeyboardHeightDP + (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP ? 48 : 0);
            private final Rect rect = new Rect();

            @Override
            public void onGlobalLayout() {
                int estimatedKeyboardHeight = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, EstimatedKeyboardDP, parentView.getResources().getDisplayMetrics());
                parentView.getWindowVisibleDisplayFrame(rect);
                int heightDiff = parentView.getRootView().getHeight() - (rect.bottom - rect.top);
                boolean isShown = heightDiff >= estimatedKeyboardHeight;

                if (isShown == alreadyOpen) {
                    return;
                }
                alreadyOpen = isShown;
                onKeyboardVisibilityListener.onVisibilityChanged(isShown);
            }
        });
    }

    @Override
    public void onVisibilityChanged(boolean visible) {
        hideSystemUI();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    protected void setLockTask() {
        // Проверка владельца устройства
        if (mDevicePolicyManager.isLockTaskPermitted(packageName)) {
            String[] packages = {packageName};
            mDevicePolicyManager.setLockTaskPackages(mAdminComponentName, packages);
        } /* else {
            Toast.makeText(getApplicationContext(), "Not device owner", Toast.LENGTH_LONG).show();
        }*/
        startLockTask();
    }

    /**
     * Задание приложению статус дефолтового
     */
    protected void setAppAsDefault() {
        if (mDevicePolicyManager.isLockTaskPermitted(packageName)) {
            IntentFilter intentFilter = new IntentFilter(Intent.ACTION_MAIN);
            intentFilter.addCategory(Intent.CATEGORY_HOME);
            intentFilter.addCategory(Intent.CATEGORY_DEFAULT);
            mDevicePolicyManager.addPersistentPreferredActivity(mAdminComponentName,
                    intentFilter, new ComponentName(packageName, MainActivity.class.getName()));
        }
    }

    /**
     * Для того чтобы после перезагрузки не отображался экран блокировки
     */
    @RequiresApi(api = Build.VERSION_CODES.M)
    protected void setDisableKeyguard() {
        if (mDevicePolicyManager.isLockTaskPermitted(packageName)) {
            mDevicePolicyManager.setKeyguardDisabled(mAdminComponentName, true);
        }
    }

    protected void setKeepScreenOn() {
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (mDevicePolicyManager.isLockTaskPermitted(packageName)) {
            mDevicePolicyManager.setGlobalSetting(mAdminComponentName,
                    Settings.Global.STAY_ON_WHILE_PLUGGED_IN,
                    Integer.toString(BatteryManager.BATTERY_PLUGGED_AC
                            | BatteryManager.BATTERY_PLUGGED_USB
                            | BatteryManager.BATTERY_PLUGGED_WIRELESS));
        }
    }

    /**
     * Возвращает имя основного компонента (react-native).
     */
    @Override
    protected String getMainComponentName() {
        return "TornadoOrderPicker";
    }

    /**
     * Скрывает системный UI
     */
    @RequiresApi(api = Build.VERSION_CODES.HONEYCOMB)
    protected void hideSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
            getSupportActionBar().setHomeButtonEnabled(false);
            getSupportActionBar().hide();
        }
    }

    /**
     * Блокировка кнопок громкости
     */
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Блокировка кнопки "назад"
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            return true;
        }

        // Блокировка кнопки громкости
        if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
            return true;
        }

        // Блокировка кнопки громкости
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }

    /**
     * Устанавливает максимальную громкость
     */
    private void setVolumeToMax() {
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        am.setStreamVolume(
                AudioManager.STREAM_SYSTEM,
                am.getStreamMaxVolume(AudioManager.STREAM_SYSTEM),
                0);
    }
}
