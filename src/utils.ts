
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

