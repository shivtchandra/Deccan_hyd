// Texture Atlas Manager adapted from singhanat/isometric-city
// Parses Kenney XML TextureAtlases and manages authored Hyderabad sprites

export class AtlasManager {
  constructor() {
    this.sprites = new Map();
    this.images = new Map();
    this.isLoaded = false;
  }

  async loadSheet(name, xmlPath, imgPath) {
    try {
      const [xmlText, img] = await Promise.all([
        fetch(xmlPath).then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status} for ${xmlPath}`);
          return res.text();
        }),
        this.loadImage(imgPath),
      ]);

      this.images.set(name, img);

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const subTextures = xmlDoc.getElementsByTagName("SubTexture");

      for (let i = 0; i < subTextures.length; i++) {
        const st = subTextures[i];
        const spriteName = st.getAttribute("name");
        const x = parseInt(st.getAttribute("x"), 10);
        const y = parseInt(st.getAttribute("y"), 10);
        const width = parseInt(st.getAttribute("width"), 10);
        const height = parseInt(st.getAttribute("height"), 10);

        this.sprites.set(spriteName, {
          img,
          x,
          y,
          width,
          height,
          sheetName: name,
        });
      }
      return true;
    } catch (err) {
      console.warn(`AtlasManager: Failed to load sheet ${name}:`, err);
      return false;
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Register an individual image or canvas as a named sprite
  registerCustomSprite(name, imgOrCanvas, width, height) {
    this.sprites.set(name, {
      img: imgOrCanvas,
      x: 0,
      y: 0,
      width: width || imgOrCanvas.width,
      height: height || imgOrCanvas.height,
      sheetName: "custom",
    });
  }

  getSprite(name) {
    return this.sprites.get(name) || null;
  }

  hasSprite(name) {
    return this.sprites.has(name);
  }
}
