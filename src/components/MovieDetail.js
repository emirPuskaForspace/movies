import { Router } from "@lightningjs/sdk";
import { getImageUrl, getMovieDetails } from "../lib/api";
import MoviePage from "./MoviePage";

export default class MovieDetail extends MoviePage {
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
    this.addDataToSlider("/movie/" + movieId + "/similar");

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
        Overview: { text: { text: movie.overview } },
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

  _handleBack() {
    this.index = 0;
    Router.navigate("$");
  }
}
