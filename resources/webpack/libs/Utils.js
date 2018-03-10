class Utils {
  static calcVectorDirection(vector) {
    let direction;
    const rad = Math.atan2(vector.y, vector.x);
    let theta = (rad / (2 * Math.PI)) * 360; // -179.9999 ~ 180
    theta = (theta < 0) ? 360 + theta : theta; // 0 ~ 359.9999

    if (theta < 45) {
      direction = 'right';
    } else if (theta < 135) {
      direction = 'down';
    } else if (theta < 225) {
      direction = 'left';
    } else if (theta < 315) {
      direction = 'up';
    } else {
      direction = 'right';
    }

    return direction;
  }
}

module.exports = Utils;
