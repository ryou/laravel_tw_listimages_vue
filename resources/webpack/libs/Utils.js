class Utils {
  // fetch APIは4xxエラーをrejectしてくれないので以下を参考に
  // JSONのfetch用関数作成
  // http://blog.mudatobunka.org/entry/2016/04/26/092518
  static fetchJSON(url, options) {
    const promise = fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        return response;
      })
      .then(response => response.json());

    return promise;
  };

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
  };
};

module.exports = Utils;
