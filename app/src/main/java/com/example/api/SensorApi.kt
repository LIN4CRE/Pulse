package com.example.api

import retrofit2.http.GET

interface SensorApi {
    @GET("/")
    suspend fun getSensorData(): SensorData
}
