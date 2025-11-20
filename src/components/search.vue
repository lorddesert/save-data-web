<script setup lang="ts">

type GameObject = {
  cloud: {
    steam: boolean
  },
  files: {
    [key: string]: {
       tags: string,
       when: {
        os: string
       },
    },
  }
}


import { ref } from 'vue';
import yaml from 'js-yaml'

let search = ref("")
let manifest = ref({})
let allGames = ref([])
let testOutput = ref([]) 

let manifestDownloaded = ref(false)

let games = ""


async function downloadManifest() {
  const manifestURL = "https://raw.githubusercontent.com/mtkennerly/ludusavi-manifest/master/data/manifest.yaml"
  try {
    const res = await fetch(manifestURL)
    const data = await res.text()

    const gameData = yaml.load(data) as any

    manifest.value = gameData

    games = gameData

    manifestDownloaded.value = true
  } catch(e) {
    console.error('Something happened')
    console.log(e)
  }
}

async function searchGame(event: SubmitEvent) {
  const formData = event.target as HTMLFormElement
  const data = new FormData(formData)
  const game = data.get("search")
  const manifestData = Object.keys(manifest.value)
  const startsWith = data.get("starts-with")


  const regex = new RegExp(`${startsWith ? '^' : ''}${game}`, "gmi")

  console.log({regex})

  let possibleMatches = manifestData.filter(item => {
    return item.match(regex)
  })
  
  console.log({game, manifestData, possibleMatches})

  // const a = Reflect.get(manifestData, "Elden Ring")

  // const b = JSON.parse(JSON.stringify(a))

  testOutput.value = possibleMatches
}

</script>

<template>
  <form v-on:submit.prevent="searchGame">
    <legend>
      <p>Manifest downloaded:  <span class="download-manifest-badge" :class="manifestDownloaded ? 'success' : 'error'">{{ manifestDownloaded ? "Yes" : "No" }} </span> </p>
    </legend>
    <section>
      <label for="starts-with">Empieza con</label>
      <input type="checkbox" id="starts-with" name="starts-with" />
    </section>
    <label for="search">Buscar juego</label>
    <input type="search" id="search" name="search" />

    <button :disabled="!manifestDownloaded" type="submit">GO!</button> 
   <button :disabled="manifestDownloaded" @click="downloadManifest">Descargar manifiesto</button>
  </form>
  <div>
      <pre>
        {{ testOutput }}
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
  padding: .5rem 1rem;
  background-color: black;
  border-radius: 15px;

}

.success {
  color: aquamarine;
}

.error {
  color: crimson;
}
</style>