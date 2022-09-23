import { Lightning, Router } from "@lightningjs/sdk";

export class NotFound extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xfffb2d2d,
      },
      Title: {
        mount: 0.5,
        x: 960,
        y: 50,
        text: {
          text: "404 - Not Found",
          fontSize: 64,
        },
      },
    };
  }

  _handleBack() {
    Router.navigate("home");
  }
}