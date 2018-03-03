export default class LoopController {
  constructor(callback, fps = 60) {
    this.FPS = fps;
    this.FRAME_TIME = 1000 / fps;
    this.callback = callback;
    this.animationId = null;
  }

  start() {
    const startTime = performance.now();
    let beforeTime = startTime;
    this.callback();

    const mainLoop = () => {
      this.animationId = requestAnimationFrame(mainLoop);

      const currentTime = performance.now();
      let pastTime = currentTime - beforeTime;
      while (pastTime > this.FRAME_TIME) {
        pastTime -= this.FRAME_TIME;
        beforeTime += this.FRAME_TIME;
        this.callback();
      }
    };
    mainLoop();
  }

  pause() {
    cancelAnimationFrame(this.animationId);
  }
}
