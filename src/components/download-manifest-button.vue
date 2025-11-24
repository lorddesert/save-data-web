<script setup lang="ts">
import { $manifest, $manifestDownloaded } from "@/stores/manifest";
import { downloadManifest } from "@/utils";
import { useStore } from "@nanostores/vue";

const manifestDownloaded = useStore($manifestDownloaded)

async function getManifest() {
  try {
    let manifest = await downloadManifest();

    $manifest.set(manifest);
  } catch (e) {
    console.error("Something happened");
    console.log(e);
  }
}
</script>

<template>
  <button :disabled="manifestDownloaded" @click="getManifest" type="button">
    Descargar manifiesto
  </button>
</template>