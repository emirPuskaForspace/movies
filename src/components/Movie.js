import { Lightning, Router } from "@lightningjs/sdk";
import Tile from "./Tile";
import { getImageUrl, getMovies } from "../lib/api";

export default class Movie extends Lightning.Component {
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
          fontSize: 75,
        },
        x: 42,
        y: 30,
        zIndex: 10,
      },
      Slider: {
        x: 480,
        y: 500,
        mount: 0.5,
        w: 800,
        h: 350,
        Wrapper: {},
      },
    };
  }

  _init() {
    this.page = 1;
    this.index = 0;
    this.dataLength = 0;
    this.loadedData = [];

    this.addDataToScreen(this.page);
    this.animation = this.tag("Slider").animation({
      duration: 5,
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
    this.tag('Background')
    .animation({
      duration: 15,
      repeat: -1,
      actions: [
        {
          t: '',
          p: 'color',
          v: { 0: { v: 0xff2e003e }, 0.5: { v: 0xff4b0065}, 0.8: { v: 0xff2e003e } },
        },
      ],
    })
    .start()
  }

  async addDataToScreen(pageIndex) {
    const data = await getMovies("/movie/upcoming?page=" + pageIndex);
    this.loadedData = data.results;
    this.dataLength = data.results.length;
    let movies = [];
    for (let i = 0; i < this.dataLength - 1; i++) {
      const movie = data.results[i];
      movies.push({
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
    this.tag("Wrapper").children = movies;
  }

  _getFocused() {
    return this.tag("Wrapper").children[this.index];
  }

  _handleLeft() {
    if (this.index === 0) {
      this.index = this.dataLength - 1;
      this.page = this.page - 1;
      if (this.page < 1) {
        this.page = 1;
      }
      this.addDataToScreen(this.page);
      this._animate();
    } else {
      this.index -= 1;
    }
    this.repositionWrapper();
  }

  _handleRight() {
    if (this.index === this.dataLength - 1) {
      this.page++;
      this.addDataToScreen(this.page);
      this.index = 0;
      this._animate();
    } else {
      this.index += 1;
    }
    this.repositionWrapper();
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
    const title = this.tag("Title");

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
    console.log("Movie ID " + movieId);
    Router.navigate("movie", { movieId: movieId });
  }
}
