const sliderAnimation = {
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
};

const backgroundAnimation = {
  duration: 5,
  repeat: -1,
  actions: [
    {
      t: "",
      p: "color",
      v: {
        0: { v: 0xff3d3d3b },
        0.5: { v: 0xff50504e},
        0.8: { v: 0xff3d3d3b },
      },
    },
  ],
};

const previousPageArrowAnimation = {
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
};

const previousPageTextAnimation = {
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
};

const nextPageArrowAnimation = {
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
};

const nextPageTextAnimation = {
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
};

const tileAnimation = {
  duration: 1,
  repeat: 0.5,
  stopMethod: "immediate",
  actions: [
    { p: "rotation", v: { 0: 0, 1: 6.29 } },
    { t: "Image", p: "rotation", v: { 0: 0, 1: 6.29 } },
  ],
};

export {
  sliderAnimation,
  backgroundAnimation,
  previousPageArrowAnimation,
  previousPageTextAnimation,
  nextPageArrowAnimation,
  nextPageTextAnimation,
  tileAnimation
};
