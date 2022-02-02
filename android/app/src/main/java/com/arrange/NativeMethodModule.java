package com.arrange;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import androidx.annotation.NonNull;

public class NativeMethodModule  extends ReactContextBaseJavaModule {

    public static Callback onSuccess=null;
    public static Callback onFail = null;

    NativeMethodModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "NativeMethodModule";
    }

    @ReactMethod
    public void openHyperPay(ReadableMap data, Callback onSuccess, Callback onFail) {
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        Intent intent = new Intent(getCurrentActivity(), HyperpayActivity.class);
        if(data.hasKey("checkoutId")) {
            intent.putExtra("checkoutId", data.getString("checkoutId"));
        }

        getCurrentActivity().startActivity(intent);
    }
}
