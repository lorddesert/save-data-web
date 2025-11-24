
export type GameObject = {
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

export type SearchResult = {
  name: string,
  url: string
}


export async function downloadManifest() {
  try {
    const res = await fetch('/get-manifest');
    const data = await res.json();

    return data;
  } catch (e) {
    console.error("Something happened downloading manifest");
    console.log(e);
  }
}


export interface Game {
  cloud?: Cloud
  files: Files
  id: Id
  installDir: InstallDir
  launch: Launch
  steam?: Steam
}

export interface Cloud {
  steam?: boolean
  gog?: boolean
  epic?: boolean
}

export interface Files {
  [key:string]: File
}

export interface File {
  tags?: any[]
  when?: any[]
}

export interface Id {
  lutris?: string
  steamExtra?: number[]
}

export interface InstallDir {
  [key:string]: {}
}

export interface Launch {
  [key:string]: any[][]
}

export interface Steam {
  id: number
}
