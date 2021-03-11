package com.TornadoOrderPicker.utils;

import android.os.Environment;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;

public class ExternalStorageModule extends ReactContextBaseJavaModule {

    private String storagePath;
    private ReactApplicationContext reactContext;
    private boolean storageAvailable;
    private boolean storageReadOnly;

    public ExternalStorageModule(ReactApplicationContext reactContext) throws Exception {
        super(reactContext);

        this.reactContext = reactContext;

        File root = this.reactContext.getExternalFilesDir(null);
        storagePath = root.getAbsolutePath();

        String extStorageState = Environment.getExternalStorageState();
        storageReadOnly = Environment.MEDIA_MOUNTED_READ_ONLY.equals(extStorageState);
        storageAvailable = Environment.MEDIA_MOUNTED.equals(extStorageState);
    }

    @Override
    public String getName() {
        return "ExternalStorage";
    }

    /**
     * Проверка на существование файла
     */
    @ReactMethod
    public void exists(String filepath, Promise promise) {
        boolean isExists = false;
        try {
            File file = new File(filepath);
            isExists = file.exists();
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(isExists);
    }

    /**
     * Запись файла
     */
    @ReactMethod
    public void writeFile(String filepath, String base64Content, Promise promise) {
        try {
            byte[] bytes = Base64.decode(base64Content, Base64.DEFAULT);

            File file = new File(filepath);
            file.createNewFile();

            FileOutputStream out = new FileOutputStream(file);
            out.write(bytes);
            out.flush();
            out.close();
        } catch (Exception ex) {
            ex.printStackTrace();
            promise.reject(ex);
            return;
        }

        promise.resolve(null);
    }

    /**
     * Чтение файла
     */
    @ReactMethod
    public void readFile(String filepath, Promise promise) {
        String base64 = "";

        File file = new File(filepath);
        int size = (int) file.length();
        byte[] bytes = new byte[size];
        try {
            BufferedInputStream buf = new BufferedInputStream(new FileInputStream(file));
            buf.read(bytes, 0, bytes.length);
            buf.close();

            base64 = Base64.encodeToString(bytes, Base64.DEFAULT);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        } catch (IOException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(base64);
    }

    /**
     * Удаление файла
     */
    @ReactMethod
    public void unlink(String filepath, Promise promise) {
        try {
            File file = new File(filepath);

            if (!file.exists()) throw new Exception("File does not exist");

            deleteRecursive(file);
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(null);
    }

    /**
     * Создание директории
     */
    @ReactMethod
    public void mkdir(String filepath, Promise promise) {
        try {
            File file = new File(filepath);

            boolean isCreated = file.mkdirs();

            if (!isCreated) throw new Exception("Directory could not be created");
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(null);
    }

    /**
     * Возвращает true, если внешнее хранилище (SD) доступно для чтения
     */
    @ReactMethod
    public void isStorageWritable(Promise promise) {
        promise.resolve(storageReadOnly);
    }

    /**
     * Возвращает true, если внешнее хранилище (SD) доступно
     */
    @ReactMethod
    public void isStorageAvailable(Promise promise) {
        promise.resolve(storageAvailable);
    }

    /**
     * Возвращает путь к внешнему хранилищу (SD)
     */
    @ReactMethod
    public void getPath(Promise promise) {
        promise.resolve(storagePath);
    }

    /**
     * Рекурсивное удаление
     */
    private void deleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                deleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }

    @ReactMethod
    protected void downloadFile(String urlSrc, String outputPath, Promise promise) {
        int count;
        try {
            URL url = new URL(urlSrc);
            URLConnection conection = url.openConnection();
            conection.connect();

            InputStream input = new BufferedInputStream(url.openStream(),
                    8192);

            File file = new File(outputPath);
            file.createNewFile();

            OutputStream output = new FileOutputStream(file);

            byte data[] = new byte[1024];

            long total = 0;

            while ((count = input.read(data)) != -1) {
                total += count;
                output.write(data, 0, count);
            }

            output.flush();
            output.close();
            input.close();
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(e);
            return;
        }

        promise.resolve(null);
    }
}