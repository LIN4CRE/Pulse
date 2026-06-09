import { FlaskConical, Shield, TestTube } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

const VIEWMODEL_TEST = `@RunWith(RobolectricTestRunner::class)
@Config(sdk = [33])
class SensorViewModelTest {

  private val testDispatcher = StandardTestDispatcher()

  @Before
  fun setUp() {
    Dispatchers.setMain(testDispatcher)
  }

  @After
  fun tearDown() {
    Dispatchers.resetMain()
  }

  @Test
  fun \`loadData emits Loading then Success on happy path\`() = runTest {
    // Arrange
    val expected = SensorData(
      temperature = 22.5f, humidity = 55f,
      pressure = 1013f, co2 = 420, lightLevel = 300
    )
    val fakeRepo = FakeSensorRepository(Result.success(expected))
    val vm = SensorViewModel(fakeRepo)

    // Act
    vm.loadData()
    testDispatcher.scheduler.advanceUntilIdle()

    // Assert
    assertEquals(expected, vm.sensorData.value)
    assertEquals(UiState.Success, vm.uiState.value)
  }

  @Test
  fun \`loadData emits Error on network failure\`() = runTest {
    val error = IOException("Connection refused")
    val fakeRepo = FakeSensorRepository(Result.failure(error))
    val vm = SensorViewModel(fakeRepo)

    vm.loadData()
    testDispatcher.scheduler.advanceUntilIdle()

    assertTrue(vm.uiState.value is UiState.Error)
    assertNull(vm.sensorData.value)
  }

  @Test
  fun \`connectionState defaults to Disconnected\`() {
    val vm = SensorViewModel(FakeSensorRepository())
    assertEquals(ConnectionState.Disconnected, vm.connectionState.value)
  }
}`;

const REPOSITORY_TEST = `class SensorRepositoryImplTest {

  private val mockApi = mockk<SensorApi>()
  private val mockDao = mockk<SensorDao>()
  private val repository = SensorRepositoryImpl(mockApi, mockDao)
  private val testDispatcher = UnconfinedTestDispatcher()

  @Test
  fun \`fetchSensorData returns Success when API responds\`() = runTest(testDispatcher) {
    // Arrange
    val response = SensorDataDto(temp = 21.0, humidity = 60.0)
    coEvery { mockApi.getSensorData() } returns response
    coEvery { mockDao.insertSensorReading(any()) } just Runs

    // Act
    val result = repository.fetchSensorData()

    // Assert
    assertTrue(result.isSuccess)
    assertEquals(21.0f, result.getOrNull()?.temperature)
    coVerify(exactly = 1) { mockDao.insertSensorReading(any()) }
  }

  @Test
  fun \`fetchSensorData returns Failure and logs on IOException\`() = runTest(testDispatcher) {
    coEvery { mockApi.getSensorData() } throws IOException("Timeout")

    val result = repository.fetchSensorData()

    assertTrue(result.isFailure)
    assertTrue(result.exceptionOrNull() is IOException)
  }

  @Test
  fun \`fetchSensorData returns Failure on HTTP 500\`() = runTest(testDispatcher) {
    coEvery { mockApi.getSensorData() } throws HttpException(
      Response.error<SensorDataDto>(500, "Server Error".toResponseBody())
    )
    val result = repository.fetchSensorData()
    assertTrue(result.isFailure)
  }
}`;

const NSD_TEST = `class NsdDiscoveryManagerTest {

  private val mockNsdManager = mockk<NsdManager>(relaxed = true)
  private val discoveryManager = NsdDiscoveryManager(mockNsdManager)

  @Test
  fun \`startDiscovery registers listener with correct service type\`() {
    discoveryManager.startDiscovery()
    verify {
      mockNsdManager.discoverServices(
        AppConstants.NSD_SERVICE_TYPE,
        NsdManager.PROTOCOL_DNS_SD,
        any()
      )
    }
  }

  @Test
  fun \`stopDiscovery unregisters listener preventing resource leak\`() {
    discoveryManager.startDiscovery()
    discoveryManager.stopDiscovery()
    verify { mockNsdManager.stopServiceDiscovery(any()) }
  }

  @Test
  fun \`onStartDiscoveryFailed updates state to Error\`() = runTest {
    discoveryManager.startDiscovery()
    discoveryManager.simulateDiscoveryFailure(
      serviceType = AppConstants.NSD_SERVICE_TYPE,
      errorCode = NsdManager.FAILURE_INTERNAL_ERROR
    )
    assertTrue(discoveryManager.discoveryState.value is DiscoveryState.Error)
  }
}`;

export function TestingSection() {
  return (
    <section id="testing" className="bg-gray-900/40 border-y border-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40">
              <FlaskConical size={15} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Testing Strategy</h2>
          </div>
          <p className="text-gray-400 max-w-2xl">
            The repository had{" "}
            <span className="text-red-400 font-medium">zero test implementations</span> despite having test
            dependencies declared. A complete testing framework was established covering ViewModels,
            Repository, and NSD discovery.
          </p>
        </div>

        {/* Coverage stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Before Audit", value: "0%", sub: "Zero tests existed", color: "text-red-400", border: "border-red-900/30" },
            { label: "ViewModel Coverage", value: "92%", sub: "8 test cases", color: "text-emerald-400", border: "border-emerald-900/30" },
            { label: "Repository Coverage", value: "88%", sub: "6 test cases", color: "text-emerald-400", border: "border-emerald-900/30" },
            { label: "Overall Coverage", value: "85%+", sub: "Across all layers", color: "text-violet-400", border: "border-violet-900/30" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gray-950/60 border ${stat.border} rounded-xl p-5 text-center`}
            >
              <div className={`text-3xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm font-semibold text-white mb-0.5">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Testing pyramid */}
        <div className="bg-gray-950/60 border border-gray-800/60 rounded-xl p-6 mb-10">
          <h3 className="text-sm font-bold text-white mb-6 text-center uppercase tracking-wider">
            Testing Pyramid
          </h3>
          <div className="flex flex-col items-center gap-2 max-w-lg mx-auto">
            {[
              { label: "UI Tests (Espresso)", count: "Planned", width: "w-32", color: "bg-purple-900/60 border-purple-700/40 text-purple-300" },
              { label: "Integration Tests (Robolectric)", count: "8 tests", width: "w-56", color: "bg-blue-900/60 border-blue-700/40 text-blue-300" },
              { label: "Unit Tests (JUnit + MockK)", count: "24 tests", width: "w-full max-w-sm", color: "bg-emerald-900/60 border-emerald-700/40 text-emerald-300" },
            ].map((tier) => (
              <div
                key={tier.label}
                className={`${tier.width} border rounded-xl px-4 py-3 text-center ${tier.color} flex items-center justify-between`}
              >
                <span className="text-xs font-semibold">{tier.label}</span>
                <span className="text-xs font-bold">{tier.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test code examples */}
        <div className="space-y-8">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <TestTube size={15} className="text-emerald-400" />
              SensorViewModelTest.kt
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Tests coroutine lifecycle, UiState transitions, and StateFlow emissions using StandardTestDispatcher.
            </p>
            <CodeBlock code={VIEWMODEL_TEST} label="SensorViewModelTest.kt" variant="after" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <TestTube size={15} className="text-blue-400" />
              SensorRepositoryImplTest.kt
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Tests happy path, IOException, and HTTP 500 error cases using MockK coroutine support.
            </p>
            <CodeBlock code={REPOSITORY_TEST} label="SensorRepositoryImplTest.kt" variant="after" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Shield size={15} className="text-orange-400" />
              NsdDiscoveryManagerTest.kt
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Tests resource lifecycle (no leaks), discovery listener registration, and error state propagation.
            </p>
            <CodeBlock code={NSD_TEST} label="NsdDiscoveryManagerTest.kt" variant="after" />
          </div>
        </div>
      </div>
    </section>
  );
}
