import { atom, computed } from 'nanostores'

export const $manifest = atom({})
export const $manifestDownloaded = computed($manifest, (manifest) => Object.keys(manifest).length > 0)
