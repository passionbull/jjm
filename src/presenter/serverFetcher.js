export default class serverFetcher {
  constructor() {}
  
  getPreFixedMessage(that) {
    return fetch(
      "https://s3.ap-northeast-2.amazonaws.com/img.passionbull.net/test/jjm-voting-message.json",
      { mode: "cors" }
    )
      .then(response => response.json())
      .then(responseJson => {
        var votingMessage = [];
        for (const msg of responseJson.message) {
          votingMessage.push(msg.text);
        }
        that.setState({ prefix_text: votingMessage }, () => {
          console.log(that.state.prefix_text);
        });
        return responseJson.message;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
