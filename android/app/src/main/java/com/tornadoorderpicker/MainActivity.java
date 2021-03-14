package com.tornadoorderpicker;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    String packageName;
    ComponentName mAdminComponentName;
    DevicePolicyManager mDevicePolicyManager;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
            getSupportActionBar().setHomeButtonEnabled(false);
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
