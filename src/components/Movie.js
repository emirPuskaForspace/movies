import { Lightning, Router, Utils } from "@lightningjs/sdk";
import Tile from "./Tile";
import { getImageUrl, getMovies } from "../lib/api";

export default class Movie extends Lightning.Component {
  _init() {
    this.page = 1;
    this.index = 0;
    this.dataLength = 0;
    this.loadedData = [];

    this.addDataToScreen(this.page);
    this.animation = this.tag("Slider").animation({
      duration: 2,
      repeat: -1,
      //we can animate multiple properties
      actions: [
        {
          p: "y",
          v: {
            0: 500,
            0.5: 550,
            1: 500,
          },
        },
      ],
    });
    this.tag("Background")
      .animation({
        duration: 5,
        repeat: -1,
        actions: [
          {
            t: "",
            p: "color",
            v: {
              0: { v: 0xff2e003e },
              0.5: { v: 0xff4b0065 },
              0.8: { v: 0xff2e003e },
            },
          },
        ],
      })
      .start();
    this.previousPageAnimation = this.tag("PreviousPageIndicator").animation({
      duration: 1,
      repeat: -1,
      actions: [
        {
          p: "y",
          v: {
            0: { v: 100 },
            0.5: { v: 80 },
            0.8: { v: 90 },
            1: { v: 100 },
          },
        },
      ],
    });
    this.previousTextAnimation = this.tag("Previous").animation({
      duration: 1,
      repeat: -1,
      actions: [
        {
          p: "y",
          v: {
            0: { v: 150 },
            0.5: { v: 130 },
            0.8: { v: 140 },
            1: { v: 150 },
          },
        },
      ],
    });
    this.tag("NextPageIndicator")
      .animation({
        duration: 1,
        repeat: -1,
        actions: [
          {
            p: "y",
            v: {
              0: { v: 900 },
              0.5: { v: 950 },
              0.8: { v: 920 },
              1: { v: 900 },
            },
          },
        ],
      })
      .start();
    this.tag("Next")
      .animation({
        duration: 1,
        repeat: -1,
        actions: [
          {
            p: "y",
            v: {
              0: { v: 800 },
              0.5: { v: 850 },
              0.8: { v: 820 },
              1: { v: 800 },
            },
          },
        ],
      })
      .start();
  }

  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff2e003e,
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
      Next: {
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
          rotation: Math.PI * 1, //rotation for 270 degreee
        },
      },
    };
  }

  async addDataToScreen(pageIndex) {
    const data = await getMovies("/movie/upcoming?page=" + pageIndex);
    this.loadedData = data.results;
    this.dataLength = data.results.length;
    let movieTiles = [];
    for (let i = 0; i < this.dataLength; i++) {
      const movie = data.results[i];
      movieTiles.push({
        type: Tile,
        x: 350 * i,
        Image: {
          src: getImageUrl(movie.poster_path || movie.profile_path),
        },
        Label: {
          text: {
            text: movie.title || movie.name,
          },
        },
      });
    }
    this.tag("Wrapper").children = movieTiles;
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
      this.index = 0;
      this.page--;
      this._handlePreviousPageArrowVisibility();
      this.addDataToScreen(this.page);
      this._animate();
    }
  }

  _handleDown() {
    this.index = 0;
    this.page++;
    this._handlePreviousPageArrowVisibility();
    this.addDataToScreen(this.page);
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

  repositionWrapper() {
    const wrapper = this.tag("Wrapper");
    const sliderWidth = this.tag("Slider").w;

    const currentWrapperX = wrapper.transition("x").targetvalue || wrapper.x;
    const currentFocusChild = wrapper.children[this.index];

    const currentFocusX = currentFocusChild.x + currentWrapperX;
    const currentFocusOuterWidth = currentFocusChild.x + currentFocusChild.w;
    if (currentFocusX < 0) {
      wrapper.patch({
        smooth: {
          x: -currentFocusChild.x,
        },
      });
    } else if (currentFocusOuterWidth > sliderWidth) {
      wrapper.patch({
        smooth: {
          x: sliderWidth - currentFocusOuterWidth,
        },
      });
    }
  }

  _handleEnter() {
    const movieId = this.loadedData[this.index].id;
    Router.navigate("movie-detail", { movieId: movieId });
  }

  _handleBack(){
    
  }
}
