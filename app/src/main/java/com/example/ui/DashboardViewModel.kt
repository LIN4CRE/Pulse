package com.example.ui

import android.app.Application
import android.net.nsd.NsdServiceInfo
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.api.RetrofitClient
import com.example.api.SensorData
import com.example.nsd.SensorDiscoveryManager
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

sealed class DashboardState {
    object Discovering : DashboardState()
    data class Connected(
        val url: String,
        val lastData: SensorData,
        val previousData: SensorData? = null,
        val isOffline: Boolean = false,
        val lastUpdated: Long = System.currentTimeMillis()
    ) : DashboardState()
    data class Error(val message: String) : DashboardState()
}

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    private val discoveryManager = SensorDiscoveryManager(application)

    private val _state = MutableStateFlow<DashboardState>(DashboardState.Discovering)
    val state: StateFlow<DashboardState> = _state.asStateFlow()

    private val _discoveredServices = MutableStateFlow<List<NsdServiceInfo>>(emptyList())
    val discoveredServices = _discoveredServices.asStateFlow()

    private var pollingJob: Job? = null
    var activeUrl: String? = null
    
    private var discoveryJob: Job? = null
    
    private val prefs = application.getSharedPreferences("dashboard_prefs", android.content.Context.MODE_PRIVATE)

    init {
        val lastUrl = prefs.getString("last_url", null)
        if (lastUrl != null) {
            connectToDevice(lastUrl)
        } else {
            startDiscovery()
        }
    }
    
    fun disconnect() {
        pollingJob?.cancel()
        activeUrl = null
        prefs.edit().remove("last_url").apply()
        startDiscovery()
    }

    fun startDiscovery() {
        _state.value = DashboardState.Discovering
        discoveryJob?.cancel()
        discoveryJob = viewModelScope.launch {
            discoveryManager.discoverServices().collect { services ->
                _discoveredServices.value = services
                // Auto connect to first one if we aren't connected
                if (pollingJob == null && services.isNotEmpty()) {
                    val service = services.first()
                    service.host?.hostAddress?.let { ip ->
                        val url = "http://$ip:${service.port}"
                        connectToDevice(url)
                    }
                }
            }
        }
    }

    fun connectToDevice(url: String) {
        pollingJob?.cancel()
        activeUrl = url
        prefs.edit().putString("last_url", url).apply()
        pollingJob = viewModelScope.launch {
            val api = RetrofitClient.create(url)
            while (isActive) {
                try {
                    val data = api.getSensorData()
                    val currentState = _state.value
                    val previousData = if (currentState is DashboardState.Connected) currentState.lastData else null
                    
                    _state.value = DashboardState.Connected(
                        url = url, 
                        lastData = data, 
                        previousData = previousData,
                        isOffline = false,
                        lastUpdated = System.currentTimeMillis()
                    )
                } catch (e: Exception) {
                    val currentState = _state.value
                    if (currentState is DashboardState.Connected) {
                        // Fallback protection: Keep showing last data but indicate offline status
                        _state.value = currentState.copy(isOffline = true)
                    } else {
                        _state.value = DashboardState.Error("Connection failed to $url: ${e.message}")
                    }
                }
                delay(1000) // Poll every 1 second
            }
        }
    }

    fun manualConnect(ipOrUrl: String) {
        val url = if (ipOrUrl.startsWith("http")) ipOrUrl else "http://$ipOrUrl:3000"
        connectToDevice(url)
    }
}
