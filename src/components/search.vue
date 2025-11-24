<script setup lang="ts">
import * as z from "zod";
import { ref, type Ref } from "vue";
import { downloadManifest, type SearchResult } from "@/utils";
import { useStore } from "@nanostores/vue";
import { $manifest, $manifestDownloaded } from "@/stores/manifest";

// State
let searchResults: Ref<SearchResult[] | []> = ref([]);
const manifestDownloaded = useStore($manifestDownloaded)
const manifest = useStore($manifest)
let submitError = ref("");
let hasSubmitted = ref(false);

const searchFormSchema = z.object({
  search: z.string().min(1, "Minimo 1 caracter."),
  "starts-with": z.string().optional().nullable(),
});

// Methods

async function searchGame(event: SubmitEvent) {
  hasSubmitted.value = true;

  if (!manifestDownloaded.value) {
    console.log("ATENCION: DESCARGANDO MANIFIESTO...");
    $manifest.set(await downloadManifest())
  }

  const formData = event.target as HTMLFormElement;
  const data = new FormData(formData);

  const dataToParse = {
    search: data.get("search"),
    "starts-with": data.get("starts-with"),
  };

  const result = searchFormSchema.safeParse(dataToParse);

  if (!result.success) {
    console.error(result.error.message);
    hasSubmitted.value = false;
    return;
  }

  const game = data.get("search");
  const manifestData = Object.keys(manifest.value);

  const startsWith = data.get("starts-with");

  const regex = new RegExp(`${startsWith ? "^" : ""}${game}`, "gmi");

  let possibleMatches: SearchResult[] = manifestData
    .filter((item) => {
      return item.match(regex);
    })
    .map((item) => ({
      name: item,
      url: encodeURI(item),
    }));

  searchResults.value = possibleMatches;
  hasSubmitted.value = false;
}
</script>

<template>
  <form v-on:submit.prevent="searchGame">
    <legend>
      <div class="test">
        <p>
          Manifest downloaded:
          <span class="download-manifest-badge" :class="manifestDownloaded ? 'success' : 'error'">{{ manifestDownloaded
            ? "Yes" : "No" }}
          </span>
        </p>
      </div>
    </legend>
    <section>
      <h5>Opciones</h5>
      <input type="checkbox" id="starts-with" name="starts-with" />
      <label for="starts-with">Empieza con</label>
    </section>
    <label for="search">Nombre del juego</label>
    <input type="search" id="search" name="search" placeholder="Dark souls..." />

    <p v-if="submitError">{{ submitError }}</p>
      <button :disabled="hasSubmitted" type="submit">
        {{ hasSubmitted && manifestDownloaded  
        ? "Buscando..."
        : hasSubmitted
          ? "Descargando manifiesto..."
          : "GO!"
      }}
      </button>
      <!-- <button
      :disabled="manifestDownloaded"
      type="button"
      @click="downloadManifest"
    >
      Descargar manifiesto
    </button> -->

      <!-- <DownloadManifestButton /> -->
  </form>

  <section v-if="searchResults.length">
    <h2>Resultados</h2>
    <ul>
      <li class="game-result" v-for="game in searchResults">
        <a :href="`/${game.url}`">
          {{ game.name }}
        </a>
      </li>
    </ul>
  </section>
  <div class="test">
    <pre>
        {{ searchResults }}
      </pre>
  </div>
</template>

<style>
form {
  display: grid;
  gap: 1rem;

  max-width: 680px;
  margin: 0 auto;
}

.download-manifest-badge {
  padding: 0.5rem 1rem;
  background-color: black;
  border-radius: 15px;
}

.success {
  color: aquamarine;
}

.error {
  color: crimson;
}

.test {
  padding: .5rem;
  border: 1px solid crimson;

  &:before {
    content: "test";
    display: block;
    font-size: 14px;
    color: crimson;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    font-weight: bold;
  }
}

.button-group {
  display: grid;
  place-content: center start;
  grid-template-columns: auto 1fr;
  gap: 1rem;
}
</style>
