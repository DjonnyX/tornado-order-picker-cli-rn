# TornadoOrderPicker

## Install app as kiosk mode

Установка администратора устройства:

```
adb shell dpm set-device-owner com.tornadoorderpicker/.TornadoDeviceAdminReceiver
```

Обновление приложения:

```
adb install -r path/to/tornado-order-picker.apk
```

Удаление администратора устройства:

```
adb shell dpm remove-active-admin com.tornadoorderpicker/.TornadoDeviceAdminReceiver
```

source:
https://snow.dog/blog/kiosk-mode-android
http://wenchaojiang.github.io/blog/realise-Android-kiosk-mode/


Запуск приложения:

```
adb shell
am start -n com.tornadoorderpicker/com.tornadoorderpicker.MainActivity
```