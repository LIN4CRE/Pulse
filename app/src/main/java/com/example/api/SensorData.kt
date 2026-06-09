package com.example.api

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class SensorData(
    val temperature: Float? = null,
    val humidity: Float? = null,
    val pressure: Float? = null,
    val co2: Float? = null,
    val light: Float? = null,
    val status: String? = null
)
