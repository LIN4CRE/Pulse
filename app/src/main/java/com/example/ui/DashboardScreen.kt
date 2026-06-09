package com.example.ui

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

    val isConnected = state is DashboardState.Connected && !(state as DashboardState.Connected).isOffline
    LaunchedEffect(isConnected) {
        if (isConnected) {
             haptic.performHapticFeedback(HapticFeedbackType.LongPress)
             snackbarHostState.showSnackbar("Connected securely to sensor API")
        }
    }
    
    val isOffline = state is DashboardState.Connected && (state as DashboardState.Connected).isOffline
    LaunchedEffect(isOffline) {
        if (isOffline) {
             haptic.performHapticFeedback(HapticFeedbackType.LongPress)
             snackbarHostState.showSnackbar("Connection lost. Trying to reconnect...")
        }
    }

    // Cosmic background colors
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
            // Custom Top Bar Area
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
                    fadeIn(animationSpec = tween(500)) togetherWith fadeOut(animationSpec = tween(500))
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
                            ConnectionHeader(targetState.url, targetState.isOffline, targetState.lastUpdated)
                            Spacer(modifier = Modifier.height(32.dp))
                            ConnectedDashboard(targetState.lastData, targetState.previousData)
                        }
                        is DashboardState.Error -> {
                            ErrorView(
                                targetState.message,
                                services,
                                onConnect = { viewModel.connectToDevice(it) },
                                onRetry = {
                                    viewModel.activeUrl?.let { viewModel.connectToDevice(it) } ?: viewModel.startDiscovery()
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
    val themeText = if (isOffline) "Reconnecting..." else "Connected"

    var timeText by remember(lastUpdated, isOffline) { mutableStateOf(if (isOffline) "Checking connection..." else url) }

    LaunchedEffect(lastUpdated, isOffline) {
        if (isOffline) {
            while (true) {
                val seconds = (System.currentTimeMillis() - lastUpdated) / 1000
                timeText = "Last seen: ${if (seconds == 0L) "just now" else "${seconds}s ago"}"
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
                    themeText,
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
            Text("Connect Now", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = if (isInputValid) Color.White else Color.White.copy(alpha = 0.5f))
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
            Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.Start) {
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
                            onClick = { onConnect("http://$ip:${service.port}") }
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
                                        "$ip:${service.port}",
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
        data.temperature?.let { SensorConfig("Temperature", it, prevData?.temperature, null, "°C", Icons.Default.DeviceThermostat, Color(0xFFF43F5E), it > 30f || it < 10f) },
        data.humidity?.let { SensorConfig("Humidity", it, prevData?.humidity, null, "%", Icons.Default.WaterDrop, Color(0xFF3B82F6), it > 65f) },
        data.pressure?.let { SensorConfig("Pressure", it, prevData?.pressure, null, "hPa", Icons.Default.Air, Color(0xFF10B981), it < 1000f) },
        data.co2?.let { SensorConfig("CO2", it, prevData?.co2, null, "ppm", Icons.Default.Co2, Color(0xFFF59E0B), it > 1000f) },
        data.light?.let { SensorConfig("Light Level", it, prevData?.light, null, "lx", Icons.Default.Lightbulb, Color(0xFFEAB308), false) },
        data.status?.let { SensorConfig("System Status", 0f, null, it, "", Icons.Default.Info, Color(0xFF6366F1), it.lowercase() == "error" || it.lowercase() == "offline") }
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

    val borderColor = if (config.isWarning) Color(0xFFEF4444).copy(alpha = 0.5f) else Color.White.copy(alpha = 0.05f)
    val borderWidth = if (config.isWarning) 2.dp else 1.dp

    Surface(
        modifier = modifier.height(160.dp),
        shape = RoundedCornerShape(24.dp),
        color = Color.White.copy(alpha = 0.03f),
        border = androidx.compose.foundation.BorderStroke(borderWidth, borderColor)
    ) {
        Column(
            modifier = Modifier
                .padding(20.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(config.accentColor.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(config.icon, contentDescription = null, tint = config.accentColor, modifier = Modifier.size(20.dp))
                }

                if (config.stringValue == null && config.prevValue != null) {
                    val arrowIcon = if (isIncreasing) Icons.Default.TrendingUp else if (isDecreasing) Icons.Default.TrendingDown else Icons.Default.TrendingFlat
                    val arrowTint = if (isIncreasing) Color(0xFF10B981) else if (isDecreasing) Color(0xFFEF4444) else Color.White.copy(alpha = 0.3f)
                    
                    Box(
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.05f))
                            .padding(6.dp)
                    ) {
                        Icon(arrowIcon, contentDescription = null, tint = arrowTint, modifier = Modifier.size(16.dp))
                    }
                }
            }
            
            Column {
                Text(
                    config.title,
                    style = MaterialTheme.typography.labelMedium,
                    color = Color.White.copy(alpha = 0.5f),
                    fontWeight = FontWeight.Medium,
                    letterSpacing = 0.5.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                    val displayValue = config.stringValue ?: if (config.unit == "hPa" || config.unit == "lx" || config.unit == "ppm") {
                        "%.0f".format(animatedValue)
                    } else {
                        "%.1f".format(animatedValue)
                    }
                    
                    Text(
                        displayValue,
                        style = if (config.stringValue != null && config.stringValue.length > 8) MaterialTheme.typography.titleLarge else MaterialTheme.typography.headlineLarge,
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
fun ErrorView(error: String, services: List<NsdServiceInfo>, onConnect: (String) -> Unit, onRetry: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(top = 32.dp),
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
            textAlign = androidx.compose.ui.text.style.TextAlign.Center
        )
        
        Spacer(Modifier.height(32.dp))
        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.1f)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Refresh, contentDescription = null, tint = Color.White)
            Spacer(Modifier.width(8.dp))
            Text("Retry Connection", color = Color.White)
        }
        
        Spacer(Modifier.height(48.dp))
        DiscoveryView(services, onConnect)
    }
}

