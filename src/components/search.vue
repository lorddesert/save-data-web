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

/**
 * 
 * @param { string } game
 */
async function searchGame(event: SubmitEvent) {
  event.preventDefault()
  const formData = event.target as HTMLFormElement
  const data = new FormData(formData)
  const game = data.get("search")
  const manifestData = Object.keys(manifest.value)


  const regex = new RegExp(`${game}`, "gmi")

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
  <form v-on:submit="searchGame">
    <legend>
      <p>Manifest downloaded:  <span class="download-manifest-badge" :class="manifestDownloaded ? 'success' : 'error'">{{ manifestDownloaded ? "Yes" : "No" }} </span> </p>
    </legend>
    <label for="search">Search</label>
    <input type="search" id="search" name="search" />

    <button type="submit">searchGame</button> 
   <button @click="downloadManifest">Download manifest</button>
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