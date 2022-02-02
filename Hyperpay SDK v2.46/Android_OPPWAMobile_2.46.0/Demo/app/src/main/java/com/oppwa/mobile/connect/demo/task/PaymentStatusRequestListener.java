package com.oppwa.mobile.connect.demo.task;


public interface PaymentStatusRequestListener {

    void onErrorOccurred();
    void onPaymentStatusReceived(String paymentStatus);
}
