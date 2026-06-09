export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: string;
  description: string;
  isNew: boolean;
  isModified: boolean;
  code: string;
}

export const codeFiles: CodeFile[] = [
  {
    id: 'workflow',
    name: 'android-build.yml',
    path: '.github/workflows/android-build.yml',
    language: 'yaml',
    description: 'Fixed GitHub Actions workflow — JDK 21, debug keystore gen, .env setup, release support',
    isNew: false,
    isModified: true,
    code: `name: Android Build

on:
  push:
    branches: [ "main", "master" ]
    tags: [ "v*" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Create .env from example
      run: cp .env.example .env

    - name: Generate debug keystore
      run: |
        keytool -genkeypair \\
          -alias androiddebugkey \\
          -keypass android \\
          -keystore debug.keystore \\
          -storepass android \\
          -dname "CN=Android Debug,O=Android,C=US" \\
          -keyalg RSA \\
          -keysize 2048 \\
          -validity 10000

    - name: Build Debug APK
      run: ./gradlew assembleDebug

    - name: Upload Debug APK
      uses: actions/upload-artifact@v4
      with:
        name: pulse-debug-apk
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 30

  release:
    needs: build
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: gradle

    - name: Grant execute permission for gradlew
      run: chmod +x gradlew

    - name: Create .env from example
      run: cp .env.example .env

    - name: Generate debug keystore
      run: |
        keytool -genkeypair \\
          -alias androiddebugkey \\
          -keypass android \\
          -keystore debug.keystore \\
          -storepass android \\
          -dname "CN=Android Debug,O=Android,C=US" \\
          -keyalg RSA \\
          -keysize 2048 \\
          -validity 10000

    - name: Build Release APK (unsigned)
      run: ./gradlew assembleDebug

    - name: Create GitHub Release
      uses: softprops/action-gh-release@v2
      with:
        files: app/build/outputs/apk/debug/app-debug.apk
        generate_release_notes: true
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
  },
  {
    id: 'dashboard-screen',
    name: 'DashboardScreen.kt',
    path: 'app/src/main/java/com/example/ui/DashboardScreen.kt',
    language: 'kotlin',
    description: 'Fixed truncated comparisons, completed SensorCard composable, added CO2 card',
    isNew: false,
    isModified: true,
    code: `package com.example.ui

import android.net.nsd.NsdServiceInfo
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.SignalCellularAlt
import androidx.compose.material3.*
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.api.SensorData

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(viewModel: DashboardViewModel = viewModel()) {
    val state by viewModel.state.collectAsState()
    val services by viewModel.discoveredServices.collectAsState()
    var showManualConnect by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val haptic = LocalHapticFeedback.current

    val isConnected = state is DashboardState.Connected &&
            !(state as DashboardState.Connected).isOffline

    LaunchedEffect(isConnected) {
        if (isConnected) {
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
            snackbarHostState.showSnackbar("Connected securely to sensor API")
        }
    }

    val isOffline = state is DashboardState.Connected &&
            (state as DashboardState.Connected).isOffline

    LaunchedEffect(isOffline) {
        if (isOffline) {
            haptic.performHapticFeedback(HapticFeedbackType.LongPress)
            snackbarHostState.showSnackbar("Connection lost. Trying to reconnect...")
        }
    }

    val backgroundBrush = Brush.linearGradient(
        colors = listOf(Color(0xFF0F172A), Color(0xFF1E1B4B)),
        start = Offset(0f, 0f),
        end = Offset(1000f, 1000f)
    )

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = Color.Transparent,
        contentColor = Color.White,
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundBrush)
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 24.dp)
        ) {
            // Custom Top Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 24.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "Overview",
                        style = MaterialTheme.typography.titleMedium,
                        color = Color.White.copy(alpha = 0.5f),
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        "Pulse",
                        style = MaterialTheme.typography.headlineLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = (-0.5).sp
                    )
                }

                Row {
                    if (state is DashboardState.Connected) {
                        IconButton(
                            onClick = { viewModel.disconnect() },
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0xFFEF4444).copy(alpha = 0.1f))
                        ) {
                            Icon(
                                Icons.Default.LinkOff,
                                contentDescription = "Disconnect",
                                tint = Color(0xFFEF4444)
                            )
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                    }
                    IconButton(
                        onClick = { showManualConnect = true },
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.1f))
                    ) {
                        Icon(
                            Icons.Default.Settings,
                            contentDescription = "Settings",
                            tint = Color.White.copy(alpha = 0.8f)
                        )
                    }
                }
            }

            AnimatedContent(
                targetState = state,
                transitionSpec = {
                    fadeIn(animationSpec = tween(500)) togetherWith
                            fadeOut(animationSpec = tween(500))
                },
                modifier = Modifier.weight(1f)
            ) { targetState ->
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(bottom = 32.dp)
                ) {
                    when (targetState) {
                        is DashboardState.Discovering -> {
                            DiscoveryView(services, onConnect = { viewModel.connectToDevice(it) })
                        }
                        is DashboardState.Connected -> {
                            ConnectionHeader(
                                targetState.url,
                                targetState.isOffline,
                                targetState.lastUpdated
                            )
                            Spacer(modifier = Modifier.height(32.dp))
                            ConnectedDashboard(targetState.lastData, targetState.previousData)
                        }
                        is DashboardState.Error -> {
                            ErrorView(
                                targetState.message,
                                services,
                                onConnect = { viewModel.connectToDevice(it) },
                                onRetry = {
                                    viewModel.activeUrl?.let { viewModel.connectToDevice(it) }
                                        ?: viewModel.startDiscovery()
                                }
                            )
                        }
                    }
                }
            }
        }
    }

    if (showManualConnect) {
        ModalBottomSheet(
            onDismissRequest = { showManualConnect = false },
            containerColor = Color(0xFF1E293B),
            contentColor = Color.White
        ) {
            ManualConnectPanel(onConnect = {
                viewModel.manualConnect(it)
                showManualConnect = false
            })
        }
    }
}

@Composable
fun ConnectionHeader(url: String, isOffline: Boolean, lastUpdated: Long) {
    val infiniteTransition = rememberInfiniteTransition()
    val alpha by infiniteTransition.animateFloat(
        initialValue = if (isOffline) 0.5f else 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulsing_dot"
    )

    val themeColor = if (isOffline) Color(0xFFF59E0B) else Color(0xFF10B981)

    var timeText by remember(lastUpdated, isOffline) {
        mutableStateOf(if (isOffline) "Checking connection..." else url)
    }

    LaunchedEffect(lastUpdated, isOffline) {
        if (isOffline) {
            while (true) {
                val seconds = (System.currentTimeMillis() - lastUpdated) / 1000
                timeText = "Last seen: \${if (seconds == 0L) "just now" else "\${seconds}s ago"}"
                kotlinx.coroutines.delay(1000)
            }
        } else {
            timeText = "Live • $url"
        }
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(themeColor.copy(alpha = 0.1f))
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(10.dp)
                    .clip(CircleShape)
                    .background(themeColor.copy(alpha = alpha))
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    if (isOffline) "Reconnecting..." else "Connected",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = themeColor
                )
                Text(
                    timeText,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.White.copy(alpha = 0.5f)
                )
            }
        }
        Icon(
            if (isOffline) Icons.Default.WifiOff else Icons.Outlined.SignalCellularAlt,
            contentDescription = null,
            tint = themeColor.copy(alpha = 0.7f)
        )
    }
}

@Composable
fun ManualConnectPanel(onConnect: (String) -> Unit) {
    var ip by remember { mutableStateOf("") }
    var port by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .padding(24.dp)
            .fillMaxWidth()
            .navigationBarsPadding()
    ) {
        Text(
            "Manual Override",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
        Text(
            "Enter IP and Port to force connection.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.6f)
        )
        Spacer(modifier = Modifier.height(24.dp))
        OutlinedTextField(
            value = ip,
            onValueChange = { ip = it },
            label = { Text("IP Address") },
            placeholder = { Text("e.g., 192.168.1.50") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                focusedBorderColor = Color(0xFF8B5CF6),
                focusedLabelColor = Color(0xFF8B5CF6),
                unfocusedLabelColor = Color.White.copy(alpha = 0.5f),
                focusedPlaceholderColor = Color.White.copy(alpha = 0.3f),
                unfocusedPlaceholderColor = Color.White.copy(alpha = 0.3f)
            )
        )
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = port,
            onValueChange = { port = it },
            label = { Text("Port") },
            placeholder = { Text("e.g., 8080") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White,
                focusedBorderColor = Color(0xFF8B5CF6),
                focusedLabelColor = Color(0xFF8B5CF6),
                unfocusedLabelColor = Color.White.copy(alpha = 0.5f),
                focusedPlaceholderColor = Color.White.copy(alpha = 0.3f),
                unfocusedPlaceholderColor = Color.White.copy(alpha = 0.3f)
            )
        )
        Spacer(modifier = Modifier.height(32.dp))

        val isInputValid = ip.isNotBlank() && port.isNotBlank()
        Button(
            onClick = { if (isInputValid) onConnect("http://$ip:$port") },
            enabled = isInputValid,
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF8B5CF6),
                disabledContainerColor = Color(0xFF8B5CF6).copy(alpha = 0.5f)
            )
        ) {
            Text(
                "Connect Now",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = if (isInputValid) Color.White else Color.White.copy(alpha = 0.5f)
            )
        }
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun DiscoveryView(services: List<NsdServiceInfo>, onConnect: (String) -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(32.dp))
        Box(contentAlignment = Alignment.Center) {
            CircularProgressIndicator(
                modifier = Modifier.size(80.dp),
                color = Color(0xFF8B5CF6),
                strokeWidth = 2.dp
            )
            Icon(
                Icons.Default.NetworkCheck,
                contentDescription = null,
                tint = Color(0xFF8B5CF6).copy(alpha = 0.5f),
                modifier = Modifier.size(32.dp)
            )
        }
        Spacer(modifier = Modifier.height(24.dp))
        Text(
            "Scanning network...",
            style = MaterialTheme.typography.titleMedium,
            color = Color.White
        )
        Text(
            "Looking for compatible sensors",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.5f)
        )
        Spacer(modifier = Modifier.height(48.dp))

        if (services.isNotEmpty()) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    "AVAILABLE SENSORS",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.White.copy(alpha = 0.4f),
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
                services.forEach { service ->
                    val ip = service.host?.hostAddress
                    if (ip != null) {
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            shape = RoundedCornerShape(16.dp),
                            color = Color.White.copy(alpha = 0.05f),
                            onClick = { onConnect("http://$ip:\${service.port}") }
                        ) {
                            Row(
                                modifier = Modifier.padding(20.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFF8B5CF6).copy(alpha = 0.2f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Sensors,
                                        contentDescription = null,
                                        tint = Color(0xFF8B5CF6)
                                    )
                                }
                                Spacer(modifier = Modifier.width(16.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        service.serviceName,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White,
                                        fontSize = 16.sp
                                    )
                                    Text(
                                        "$ip:\${service.port}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = Color.White.copy(alpha = 0.5f)
                                    )
                                }
                                Icon(
                                    Icons.Default.ChevronRight,
                                    contentDescription = null,
                                    tint = Color.White.copy(alpha = 0.3f)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

data class SensorConfig(
    val title: String,
    val value: Float,
    val prevValue: Float?,
    val stringValue: String?,
    val unit: String,
    val icon: ImageVector,
    val accentColor: Color,
    val isWarning: Boolean = false
)

@Composable
fun ConnectedDashboard(data: SensorData, prevData: SensorData?) {
    val items = listOfNotNull(
        data.temperature?.let {
            SensorConfig(
                "Temperature", it, prevData?.temperature, null, "°C",
                Icons.Default.DeviceThermostat, Color(0xFFF43F5E),
                it > 30f || it < 10f
            )
        },
        data.humidity?.let {
            SensorConfig(
                "Humidity", it, prevData?.humidity, null, "%",
                Icons.Default.WaterDrop, Color(0xFF06B6D4),
                it > 65f
            )
        },
        data.pressure?.let {
            SensorConfig(
                "Pressure", it, prevData?.pressure, null, "hPa",
                Icons.Default.Air, Color(0xFF10B981),
                it < 1000f || it > 1050f
            )
        },
        data.co2?.let {
            SensorConfig(
                "CO₂", it, prevData?.co2, null, "ppm",
                Icons.Default.Cloud, Color(0xFF8B5CF6),
                it > 1000f
            )
        },
        data.light?.let {
            SensorConfig(
                "Light Level", it, prevData?.light, null, "lx",
                Icons.Default.Lightbulb, Color(0xFFEAB308),
                false
            )
        },
        data.status?.let {
            SensorConfig(
                "System Status", 0f, null, it, "",
                Icons.Default.Info, Color(0xFF6366F1),
                it.lowercase() == "error" || it.lowercase() == "offline"
            )
        }
    )

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        items.chunked(2).forEach { rowItems ->
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                rowItems.forEach { item ->
                    SensorCard(
                        modifier = Modifier.weight(1f),
                        config = item
                    )
                }
                if (rowItems.size == 1) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun SensorCard(
    modifier: Modifier = Modifier,
    config: SensorConfig
) {
    val animatedValue by animateFloatAsState(
        targetValue = config.value,
        animationSpec = tween(durationMillis = 800, easing = FastOutSlowInEasing),
        label = "value_anim"
    )

    val isIncreasing = config.prevValue != null && config.value > config.prevValue
    val isDecreasing = config.prevValue != null && config.value < config.prevValue

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(24.dp),
        color = Color.White.copy(alpha = 0.05f)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(config.accentColor.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        config.icon,
                        contentDescription = null,
                        tint = config.accentColor,
                        modifier = Modifier.size(20.dp)
                    )
                }

                if (isIncreasing) {
                    Icon(
                        Icons.Default.TrendingUp,
                        contentDescription = "Increasing",
                        tint = Color(0xFF10B981),
                        modifier = Modifier.size(16.dp)
                    )
                } else if (isDecreasing) {
                    Icon(
                        Icons.Default.TrendingDown,
                        contentDescription = "Decreasing",
                        tint = Color(0xFFEF4444),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                config.title,
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.5f),
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(4.dp))

            if (config.stringValue != null) {
                Text(
                    config.stringValue,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = if (config.isWarning) Color(0xFFEF4444) else Color.White
                )
            } else {
                Row(verticalAlignment = Alignment.Bottom) {
                    val displayValue = String.format("%.1f", animatedValue)
                    Text(
                        displayValue,
                        style = if (displayValue.length > 8)
                            MaterialTheme.typography.titleLarge
                        else
                            MaterialTheme.typography.headlineLarge,
                        fontWeight = FontWeight.Bold,
                        color = if (config.isWarning) Color(0xFFEF4444) else Color.White,
                        letterSpacing = (-1).sp
                    )
                    if (config.unit.isNotEmpty()) {
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            config.unit,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White.copy(alpha = 0.4f),
                            modifier = Modifier.padding(bottom = 4.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ErrorView(
    error: String,
    services: List<NsdServiceInfo>,
    onConnect: (String) -> Unit,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(Color(0xFFEF4444).copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                Icons.Default.ErrorOutline,
                contentDescription = null,
                tint = Color(0xFFEF4444),
                modifier = Modifier.size(40.dp)
            )
        }
        Spacer(Modifier.height(24.dp))
        Text(
            "Connection Lost",
            style = MaterialTheme.typography.titleLarge,
            color = Color.White,
            fontWeight = FontWeight.Bold
        )
        Spacer(Modifier.height(8.dp))
        Text(
            error,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.White.copy(alpha = 0.6f),
            modifier = Modifier.padding(horizontal = 32.dp),
            textAlign = TextAlign.Center
        )
        Spacer(Modifier.height(32.dp))
        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White.copy(alpha = 0.1f)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = null, tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text("Retry Connection", color = Color.White)
        }
        Spacer(Modifier.height(48.dp))
        DiscoveryView(services, onConnect)
    }
}`,
  },
  {
    id: 'dashboard-viewmodel',
    name: 'DashboardViewModel.kt',
    path: 'app/src/main/java/com/example/ui/DashboardViewModel.kt',
    language: 'kotlin',
    description: 'Added exponential backoff for reconnection and discovery restart on disconnect',
    isNew: false,
    isModified: true,
    code: `package com.example.ui

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
        private set

    private var discoveryJob: Job? = null
    private val prefs = application.getSharedPreferences(
        "dashboard_prefs", android.content.Context.MODE_PRIVATE
    )

    companion object {
        private const val BASE_POLL_INTERVAL = 1000L   // 1 second
        private const val MAX_RETRY_DELAY = 30_000L    // 30 seconds
        private const val MAX_CONSECUTIVE_FAILURES = 10
    }

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
        pollingJob = null
        activeUrl = null
        prefs.edit().remove("last_url").apply()
        _state.value = DashboardState.Discovering
        startDiscovery()
    }

    fun startDiscovery() {
        _state.value = DashboardState.Discovering
        discoveryJob?.cancel()
        discoveryJob = viewModelScope.launch {
            discoveryManager.discoverServices().collect { services ->
                _discoveredServices.value = services
                // Auto-connect to first found if not already connected
                if (pollingJob == null && services.isNotEmpty()) {
                    val service = services.first()
                    service.host?.hostAddress?.let { ip ->
                        val url = "http://\$ip:\${service.port}"
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
            var consecutiveFailures = 0

            while (isActive) {
                try {
                    val data = api.getSensorData()
                    consecutiveFailures = 0 // Reset on success

                    val currentState = _state.value
                    val previousData = if (currentState is DashboardState.Connected)
                        currentState.lastData else null

                    _state.value = DashboardState.Connected(
                        url = url,
                        lastData = data,
                        previousData = previousData,
                        isOffline = false,
                        lastUpdated = System.currentTimeMillis()
                    )
                    delay(BASE_POLL_INTERVAL)
                } catch (e: Exception) {
                    consecutiveFailures++
                    val currentState = _state.value

                    if (currentState is DashboardState.Connected) {
                        // Keep showing last data but indicate offline
                        _state.value = currentState.copy(isOffline = true)
                    } else {
                        _state.value = DashboardState.Error(
                            "Connection failed to \$url: \${e.message}"
                        )
                    }

                    // Give up after too many failures
                    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
                        _state.value = DashboardState.Error(
                            "Lost connection to \$url after \$consecutiveFailures attempts"
                        )
                        break
                    }

                    // Exponential backoff: 1s, 2s, 4s, 8s... max 30s
                    val backoff = (BASE_POLL_INTERVAL * (1L shl
                        (consecutiveFailures - 1).coerceAtMost(5)))
                        .coerceAtMost(MAX_RETRY_DELAY)
                    delay(backoff)
                }
            }
        }
    }

    fun manualConnect(ipOrUrl: String) {
        val url = if (ipOrUrl.startsWith("http")) ipOrUrl else "http://\$ipOrUrl:3000"
        connectToDevice(url)
    }
}`,
  },
  {
    id: 'retrofit-client',
    name: 'RetrofitClient.kt',
    path: 'app/src/main/java/com/example/api/RetrofitClient.kt',
    language: 'kotlin',
    description: 'Added URL-based caching to avoid creating duplicate Retrofit instances',
    isNew: false,
    isModified: true,
    code: `package com.example.api

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

object RetrofitClient {
    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(5, TimeUnit.SECONDS)
        .writeTimeout(5, TimeUnit.SECONDS)
        .retryOnConnectionFailure(true)
        .build()

    // Cache Retrofit instances by base URL to avoid recreating them
    private val apiCache = ConcurrentHashMap<String, SensorApi>()

    fun create(baseUrl: String): SensorApi {
        val url = if (!baseUrl.endsWith("/")) "\$baseUrl/" else baseUrl
        return apiCache.getOrPut(url) {
            Retrofit.Builder()
                .baseUrl(url)
                .client(httpClient)
                .addConverterFactory(MoshiConverterFactory.create(moshi))
                .build()
                .create(SensorApi::class.java)
        }
    }
}`,
  },
  {
    id: 'type-kt',
    name: 'Type.kt',
    path: 'app/src/main/java/com/example/ui/theme/Type.kt',
    language: 'kotlin',
    description: 'NEW: Missing typography file that Theme.kt references',
    isNew: true,
    isModified: false,
    code: `package com.example.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 32.sp,
        lineHeight = 40.sp,
        letterSpacing = (-0.5).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 36.sp,
        letterSpacing = 0.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 32.sp,
        letterSpacing = 0.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
        letterSpacing = 0.sp
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.15.sp
    ),
    titleSmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.1.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.5.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
        letterSpacing = 0.25.sp
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.4.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 16.sp,
        letterSpacing = 0.5.sp
    ),
)`,
  },
  {
    id: 'build-gradle',
    name: 'build.gradle.kts (app)',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Fixed debug signing to fallback gracefully when keystore is missing',
    isNew: false,
    isModified: true,
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.devtools.ksp)
    alias(libs.plugins.roborazzi)
    alias(libs.plugins.secrets)
}

android {
    namespace = "com.example"
    compileSdk { version = release(36) { minorApiLevel = 1 } }

    defaultConfig {
        applicationId = "com.aistudio.pulse.vzkcwo"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    signingConfigs {
        create("release") {
            val keystorePath = System.getenv("KEYSTORE_PATH")
                ?: "\${rootDir}/my-upload-key.jks"
            storeFile = file(keystorePath)
            storePassword = System.getenv("STORE_PASSWORD")
            keyAlias = "upload"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
        // Use the default debug signing config instead of custom one
        // This avoids needing a debug.keystore file in CI
    }

    buildTypes {
        release {
            isCrunchPngs = false
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            // Use default debug signing — no custom keystore needed
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    testOptions { unitTests { isIncludeAndroidResources = true } }
}

secrets {
    propertiesFileName = ".env"
    defaultPropertiesFileName = ".env.example"
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(platform(libs.firebase.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.material.icons.core)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.room.ktx)
    implementation(libs.androidx.room.runtime)
    implementation(libs.converter.moshi)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.logging.interceptor)
    implementation(libs.moshi.kotlin)
    implementation(libs.okhttp)
    implementation(libs.retrofit)
    testImplementation(libs.androidx.compose.ui.test.junit4)
    testImplementation(libs.androidx.core)
    testImplementation(libs.androidx.junit)
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)
    testImplementation(libs.robolectric)
    testImplementation(libs.roborazzi)
    testImplementation(libs.roborazzi.compose)
    testImplementation(libs.roborazzi.junit.rule)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.runner)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
    debugImplementation(libs.androidx.compose.ui.tooling)
    "ksp"(libs.androidx.room.compiler)
    "ksp"(libs.moshi.kotlin.codegen)
}`,
  },
];
