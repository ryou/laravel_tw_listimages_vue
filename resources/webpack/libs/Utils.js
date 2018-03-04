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
};

module.exports = Utils;
