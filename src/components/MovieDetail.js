import { Router } from "@lightningjs/sdk";
import { backgroundAnimation } from "../anim/animation";
import { getImageUrl, getMovieDetails } from "../lib/api";
import MoviePage from "./MoviePage";

const detailPosterSize = "w500";
export default class MovieDetail extends MoviePage {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        color: 0xff3d3d3b,
      },
      Image: {
        x: 1400,
        y: 30,
        scale: 1,
        zIndex: 1,
      },
      Title: {
        text: {
          text: "",
          textColor: 0xffffffff,
          fontSize: 45,
          w: 1000,
          flexItem: {},
        },
        x: 42,
        y: 20,
        zIndex: 10,
        flex: {},
      },
      Overview: {
        x: 42,
        y: 200,
        w: 1320,
        text: {
          text: "",
          fontSize: 32,
          textColor: 0xffffffff,
        },
      },
      SimilarBackground: {
        rect: true,
        scaleY: 0.4,
        color: 0xff3d3d3b,
        w: 1920,
        h: 800,
        x: 0,
        y: 580,
      },
      SimilarTitle: {
        x: -20,
        y: 770,
        scale: 0.5,
        text: {
          text: "Similar Movies",
          textColor: 0xffffffff,
        },
        zIndex: 12,
      },
      Slider: {
        x: 250,
        y: 955,
        scale: 0.5,
        mount: 0.5,
        w: 800,
        h: 350,
        zIndex: 12,
        Wrapper: {},
      },
    };
  }

  _init() {
    this.index = 0;
    this.dataLength = 6;
    this.tag("Background").animation(backgroundAnimation).start();
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
        src: getImageUrl(
          movie.poster_path || movie.profile_path,
          detailPosterSize
        ),
      },

      Title: {
        text: {
          text:
            "'" + movie.title + "'" + " coming at '" + movie.release_date + "'",
        },
      },
      Overview: { text: { text: movie.overview } },
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
