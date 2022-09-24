import { Lightning, Router, Utils } from "@lightningjs/sdk";
import { getImageUrl, getMovieDetails, getMovies } from "../lib/api";
import Tile from "./Tile";

export default class MovieDetail extends Lightning.Component {
  static _template() {
    return {
      Image: {
        x: 420,
        y: 0,
        w: 1215,
        h: 1308,
        scale: 0.8,
        zIndex: 1,
      },
      Sticker: {
        x: 10,
        y: 10,
        rect: true,
        w: 1900,
        h: 300,
        color: 0xff2e003e,
        alpha: 0.7,
        zIndex: 2,
        Title: {
          text: {
            text: "",
            textColor: 0xffffffff,
            fontSize: 45,
          },
          x: 42,
          y: 20,
          zIndex: 10,
        },
        Overview: {
          x: 42,
          y: 100,
          w: 1700,
          text: {
            text: "",
            fontSize: 32,
          },
        },
        SimilarBackground: {
          rect: true,
          color: 0xff2e003e,
          alpha: 0.5,
          w: 1920,
          h: 800,
          x: 0,
          y: 440,
        },
        SimilarTitle: {
          x: 20,
          y: 450,
          text: {
            text: "Similar Movies",
            textColor: 0xffffffff,
          },
          zIndex: 12,
        },
        Slider: {
          x: 480,
          y: 800,
          mount: 0.5,
          w: 800,
          h: 350,
          zIndex: 12,
          Wrapper: {},
        },
      },
    };
  }

  _init() {
    this.index = 0;
    this.dataLength = 6;
  }

  set params(data) {
    this.movieId = data.movieId;
    this.loadMovieDetails(data.movieId);
  }

  async loadMovieDetails(movieId) {
    const movie = await getMovieDetails("/movie/" + movieId);
    const similarMovies = await getMovies("/movie/" + movieId + "/similar");

    this.dataLength = similarMovies.results.length;
    let movies = [];
    for (let i = 0; i < this.dataLength; i++) {
      const similarMovie = similarMovies.results[i];
      movies.push({
        type: Tile,
        x: 350 * i,
        Image: {
          src: getImageUrl(
            similarMovie.poster_path || similarMovie.profile_path
          ),
        },
        Label: {
          text: {
            text: similarMovie.title || similarMovie.name,
          },
        },
      });
    }
    this.tag("Wrapper").children = movies;

    this.patch({
      Image: {
        src: getImageUrl(movie.poster_path || movie.profile_path),
      },
      Sticker: {
        Title: {
          text: {
            text:
              "'" +
              movie.title +
              "'" +
              " coming at '" +
              movie.release_date +
              "'",
          },
        },
        Overview: {
          text: {
            text: movie.overview,
          },
        },
      },
    });
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

  _getFocused() {
    return this.tag("Wrapper").children[this.index];
  }

  repositionWrapper() {
    const wrapper = this.tag("Wrapper");
    const sliderW = this.tag("Slider").w;
    const currentWrapperX = wrapper.transition("x").targetvalue || wrapper.x;
    const currentFocus = wrapper.children[this.index];
    const currentFocusX = currentFocus.x + currentWrapperX;
    const currentFocusOuterWidth = currentFocus.x + currentFocus.w;

    if (currentFocusX < 0) {
      wrapper.setSmooth("x", -currentFocus.x);
    } else if (currentFocusOuterWidth > sliderW) {
      wrapper.setSmooth("x", sliderW - currentFocusOuterWidth);
    }
  }

  _handleBack() {
    Router.navigate("$");
  }
}
