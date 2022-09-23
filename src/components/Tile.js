import { Lightning } from "@lightningjs/sdk";

export default class Tile extends Lightning.Component {
  static _template() {
    return {
      w: 235,
      h: 328,
      rect: true,
      color: 0xffe4dcf1,
      Image: {
        w: (w) => w,
        h: (h) => h - 50,
      },
      Label: {
        x: 10,
        y: 280,
        w: 220,
        color: 0xff000000,
        text: { fontSize: 16 },
        flex: {
          direction: "column",
        },
      },
    };
  }

  set item(obj) {
    const { label, src } = obj;
    this.patch({
      Image: { src },
      Label: { text: label.toString() },
    });
  }

  _focus() {
    this.patch({
      smooth: { color: 0xff67008b, scale: 1.5 },
      Label: {
        smooth: { color: 0xffffffff },
      },
    });
  }

  _unfocus() {
    this.patch({
      smooth: { color: 0xffffffff, scale: 1.0 },
      Label: {
        smooth: { color: 0xff000000 },
      },
    });
  }

  _firstEnable() {
    this._refocus();
  }
}