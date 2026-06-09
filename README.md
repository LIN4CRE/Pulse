# Pulse

Pulse is a real-time smart dashboard for monitoring local and remote sensors. 

**Features:**
- Automatic Zero-Configuration Networking (NSD) for local sensor discovery
- Deep styling with minimalistic "Dark Space" aesthetic
- Offline fallback protection and instant manual connection overrides
- High-visibility metrics dashboard tracking Temperature, Humidity, Pressure, CO2, Light Level, and system status
- Real-time animation components, fluid transitions, and subtle haptic feedback

Pulse seamlessly integrates directly with your hardware to provide lightning-fast, secure monitoring of your environment without relying on external cloud services or data harvesting.

## Screenshots

*(Insert screenshots here)*

## Architecture & Technologies

- **Language**: Kotlin 100%
- **UI Framework**: Jetpack Compose (Material 3)
- **Architecture**: MVVM with Coroutines & StateFlow
- **Networking**: Retrofit, OkHttp, Moshi
- **Discovery**: Custom NSD implementation utilizing Android standard components
- **CI/CD**: GitHub Actions

## Installation

You can download the latest release from the [Releases](https://github.com/repository/pulse/releases) pane, or build directly via Android Studio / Gradle:

```bash
./gradlew assembleDebug
```
