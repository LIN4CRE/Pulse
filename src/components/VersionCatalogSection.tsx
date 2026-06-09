import { ArrowRight, BookOpen, Package } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

const BEFORE_CATALOG = `[versions]
agp = "9.1.1"                    # ❌ Does not exist
kotlin = "2.2.10"                 # ❌ Does not exist
googleDevtoolsKsp = "2.3.5"       # ❌ Incompatible with Kotlin
composeBom = "2024.09.00"         # ❌ 8 months outdated
retrofit = "2.12.0"               # ❌ Does not exist
robolectric = "4.16.1"            # ❌ Pre-release
loggingInterceptor = "4.10.0"     # ❌ 2022 — outdated (security)
okhttp = "4.10.0"                 # ❌ 2022 — outdated (security)
lifecycleRuntimeKtx = "2.8.7"    # ❌ Split (should be unified)
lifecycleViewmodelCompose = "2.8.7" # ❌ Split
lifecycleRuntimeCompose = "2.8.7"   # ❌ Split
roomRuntime = "2.7.0"             # ❌ Split (should be unified)
roomKtx = "2.7.0"                 # ❌ Split
roomCompiler = "2.7.0"            # ❌ Split
moshiKotlin = "1.15.2"            # ❌ Split (should be unified)
moshiKotlinCodegen = "1.15.2"     # ❌ Split
firebase-bom = "34.12.0"          # ❌ Unused — remove
# ... 22 more entries (many orphaned)
# Total: 38 version entries`;

const AFTER_CATALOG = `[versions]
agp = "8.10.1"                   # ✅ Latest stable AGP
kotlin = "2.1.21"                # ✅ Latest stable Kotlin
googleDevtoolsKsp = "2.1.21-1.0.32" # ✅ Exactly matches Kotlin
composeBom = "2025.05.01"        # ✅ Latest Compose BOM
retrofit = "2.11.0"              # ✅ Latest stable
robolectric = "4.14.1"           # ✅ Latest stable
okhttp = "4.12.0"                # ✅ Latest — security patched
lifecycle = "2.9.1"              # ✅ Unified alias (was 3 entries)
room = "2.7.0"                   # ✅ Unified alias (was 3 entries)
moshi = "1.15.2"                 # ✅ Unified alias (was 2 entries)
# firebase-bom removed           # ✅ No Firebase usage in app
# camera/* removed               # ✅ No camera features implemented
# accompanist removed            # ✅ No permissions flow
# navigation removed             # ✅ Single-screen app
# coil removed                   # ✅ No image loading needed
# datastore removed              # ✅ Not implemented
# Total: 27 version entries (-29%)`;

const PROGUARD = `# ===== Pulse ProGuard / R8 Rules =====

# ─── Kotlin ──────────────────────────────────────────────
-keep class kotlin.Metadata { *; }
-keepclassmembers class **$WhenMappings { <fields>; }

# ─── Moshi ───────────────────────────────────────────────
-keepclasseswithmembers class * {
    @com.squareup.moshi.* <methods>;
}
-keep @com.squareup.moshi.JsonQualifier interface *
-keep class com.aistudio.pulse.**.** { *; }

# ─── Retrofit + OkHttp ───────────────────────────────────
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}
-dontwarn org.codehaus.mojo.animal_sniffer.*
-dontwarn javax.annotation.**

# ─── Room ────────────────────────────────────────────────
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-dontwarn androidx.room.paging.**

# ─── Coroutines ──────────────────────────────────────────
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembernames class kotlinx.** {
    volatile <fields>;
}

# ─── Debugging ───────────────────────────────────────────
-keepattributes SourceFile, LineNumberTable
-renamesourcefileattribute SourceFile`;

export function VersionCatalogSection() {
  return (
    <section id="versioncatalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/40">
            <Package size={15} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dependency Management</h2>
        </div>
        <p className="text-gray-400 max-w-2xl">
          The version catalog contained multiple non-existent versions, incompatible version pairs, and
          orphaned entries for features never implemented. A complete audit and cleanup was performed.
        </p>
      </div>

      {/* Summary callout */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Non-existent versions fixed", value: "6", color: "text-red-400", sub: "Build-breaking" },
          { label: "Orphaned entries removed", value: "11", color: "text-orange-400", sub: "Unused libraries" },
          { label: "Version aliases deduplicated", value: "8→3", color: "text-emerald-400", sub: "Lifecycle + Room + Moshi" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-gray-900/60 border border-gray-800/60 rounded-xl p-5 text-center hover:border-gray-700/60 transition-colors"
          >
            <div className={`text-3xl font-black mb-1 ${item.color}`}>{item.value}</div>
            <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
            <div className="text-xs text-gray-500">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Version catalog before/after */}
      <div className="mb-10">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ArrowRight size={15} className="text-amber-400" />
          libs.versions.toml — Before vs After
        </h3>
        <div className="grid lg:grid-cols-2 gap-4">
          <CodeBlock code={BEFORE_CATALOG} label="Before — Broken Version Catalog" variant="before" />
          <CodeBlock code={AFTER_CATALOG} label="After — Clean Version Catalog" variant="after" />
        </div>
      </div>

      {/* ProGuard rules */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <BookOpen size={15} className="text-violet-400" />
          proguard-rules.pro — Complete Rewrite
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          The original proguard-rules.pro contained only auto-generated comments. Since R8 (minification) was
          also disabled in the release build, this was a double failure. Both issues are now resolved with
          proper keep rules for all used libraries.
        </p>
        <CodeBlock code={PROGUARD} label="proguard-rules.pro (refactored)" variant="after" />
      </div>
    </section>
  );
}
