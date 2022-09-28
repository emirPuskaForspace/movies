import { Lightning } from "@lightningjs/sdk";
import { getImageUrl, loadMovies } from "../lib/api";
import Tile from "./Tile";

export default class MoviePage extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      w: 1920,
      h: 1080,
    };
  }
  async addDataToSlider(path) {
    const data = await loadMovies(path);
    this.loadedData = data.results;
    this.dataLength = data.results.length;
    let movieTiles = [];
    for (let i = 0; i < this.dataLength; i++) {
      const movie = data.results[i];
      movieTiles.push(this._toTile(movie, i));
    }
    this.tag("Wrapper").patch({ children: movieTiles });
    console.log('dodaje u slider');
  }

  _toTile(movie, i) {
    const spaceBetweenTiles = 310;
    return {
      type: Tile,
      x: spaceBetweenTiles * i,
      Image: {
        src: getImageUrl(movie.poster_path || movie.profile_path),
      },
      Label: {
        text: {
          text: movie.title || movie.name,
        },
      },
    };
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

  pageTransition() {
    return 'left'
  }
}
