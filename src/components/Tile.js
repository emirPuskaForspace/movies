import { Lightning } from "@lightningjs/sdk";

export default class Tile extends Lightning.Component {
  static _template() {
    return {
      w: 235,
      h: 328,
      rect: true,
      color: 0xffffffff,
      padding: 5,
      Image: {
        scale: 0.95,
        w: (w) => w,
        h: (h) => h - 50,
      },
      Label: {
        x: 5,
        y: 274,
        w: 230,
        color: 0xff000000,
        text: {
          fontSize: 25,
          textOverflow: null,
          maxLines: 2,
          overflowExt: "...",
        },
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
      smooth: { color: 0xffffffff, scale: 1.5 },
      Label: {
        smooth: { color: 0xff000000 },
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
}
