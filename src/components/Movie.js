import { Router, Utils } from "@lightningjs/sdk";
import {
  backgroundAnimation,
  nextPageArrowAnimation,
  previousPageArrowAnimation,
  previousPageTextAnimation,
  sliderAnimation,
  nextPageTextAnimation,
  tileAnimation,
} from "../anim/animation";
import MoviePage from "./MoviePage";

const UPCOMING_MOVIES_PATH = "/movie/upcoming?page=";

export default class Movie extends MoviePage {
  _init() {
    this.page = 1;
    this.index = 0;
    this.dataLength = 0;
    this.loadedData = [];

    this.addDataToSlider(UPCOMING_MOVIES_PATH + this.page);
    this.animation = this.tag("Slider").animation(sliderAnimation);
    this.tag("Background").animation(backgroundAnimation).start();
    this.previousPageAnimation = this.tag("PreviousPageIndicator").animation(
      previousPageArrowAnimation
    );
    this.previousTextAnimation = this.tag("Previous").animation(
      previousPageTextAnimation
    );
    this.tag("NextPageIndicator").animation(nextPageArrowAnimation).start();
    this.tag("NextLabel").animation(nextPageTextAnimation).start();
  }

  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff3d3d3b,
      },
      Title: {
        text: {
          text: "Upcoming Movies",
          textColor: 0xffffffff,
          fontSize: 55,
        },
        x: 42,
        y: 30,
        zIndex: 10,
      },
      Previous: {
        x: 830,
        y: 150,
        visible: false,
        text: {
          text: "Previous",
        },
      },
      PreviousPageIndicator: {
        x: 900,
        y: 100,
        flex: {},
        mount: 0.5,
        visible: false,
        Arrow: {
          src: Utils.asset("images/arrow.png"),
        },
      },
      Slider: {
        x: 500,
        y: 500,
        mount: 0.5,
        w: 800,
        h: 350,
        Wrapper: {},
      },
      NextLabel: {
        x: 850,
        y: 800,
        text: {
          text: "Next",
        },
      },
      NextPageIndicator: {
        x: 900,
        y: 900,
        flex: {},
        mount: 0.5,

        Arrow: {
          src: Utils.asset("images/arrow.png"),
          rotation: Math.PI * 1, //rotation for 180 degreee
        },
      },
    };
  }

  _getFocused() {
    return this.tag("Wrapper").children[this.index];
  }

  _handleLeft() {
    if (this.index === 0) {
      this.index = this.dataLength - 1;
    } else {
      this.index -= 1;
    }
    this.repositionWrapper();
  }

  _handleRight() {
    if (this.index === this.dataLength - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }
    this.repositionWrapper();
  }

  _handleUp() {
    if (this.page > 1) {
      this._animateTiles();
      this.index = 0;
      this.page--;
      this._handlePreviousPageArrowVisibility();
      this.addDataToSlider(UPCOMING_MOVIES_PATH + this.page);
      this._animate();
    }
  }

  _handleDown() {
    this._animateTiles();
    this.index = 0;
    this.page++;
    this._handlePreviousPageArrowVisibility();
    this.addDataToSlider(UPCOMING_MOVIES_PATH + this.page);
    this._animate();
  }

  _handlePreviousPageArrowVisibility() {
    if (this.page > 1) {
      this.tag("PreviousPageIndicator").patch({ visible: true });
      this.previousPageAnimation.start();
      this.tag("Previous").patch({ visible: true });
      this.previousTextAnimation.start();
    } else {
      this.previousPageAnimation.stop();
      this.tag("PreviousPageIndicator").patch({ visible: false });
      this.previousTextAnimation.stop();
      this.tag("Previous").patch({ visible: false });
    }
  }

  _animate() {
    this.animation.start();
    setTimeout(() => {
      this.animation.stop();
    }, 1000);
  }

  _animateTiles() {
    for (let i = 0; i < this.tag("Wrapper").children.length; i++) {
      const child = this.tag("Wrapper").children[i];
      child.animation(tileAnimation).start();
    }
  }

  _handleEnter() {
    const movieId = this.loadedData[this.index].id;
    Router.navigate("movie-detail", { movieId: movieId });
  }

  _handleBack() {}
}
