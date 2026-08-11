package com.hrms.integration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.hrms.dtos.request.PaymentRequestDTO;
import com.hrms.dtos.response.PaymentResponseDTO;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentClient {

    private final RestTemplate restTemplate;

    @Value("${payment.service.url}")
    private String paymentUrl;
//    private static final String PAYMENT_URL =
//            "http://localhost:5036/api/payment";

    public PaymentResponseDTO makePayment(
            PaymentRequestDTO request) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<PaymentRequestDTO> entity =
                new HttpEntity<>(request, headers);
        
        System.out.println("Payment URL = " + paymentUrl);

        return restTemplate.postForObject(
                paymentUrl,
                entity,
                PaymentResponseDTO.class);
    }
}