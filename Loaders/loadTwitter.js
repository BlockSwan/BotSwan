require("dotenv").config();
const Twit = require("twitter-v2");

module.exports = async (bot) => {
  let T = new Twit({
    bearer_token: process.env.TWITTER_BEARER,
  });

  async function sendMessage(tweet, bot) {
    const url = "https://twitter.com/user/status/" + tweet?.id;
    db = bot.db;
    let res = await db.Guild.getTwitterChannels();
    console.log(res);

    try {
      for (let i = 0; i < res?.length; i++) {
        const channel = await bot.channels.fetch(res[i]?._id);
        channel.send(url);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function listenForever(streamFactory, dataConsumer) {
    try {
      for await (const { data } of streamFactory()) {
        dataConsumer(data);
      }
      // The stream has been closed by Twitter. It is usually safe to reconnect.
      console.log("Stream disconnected healthily. Reconnecting.");
      listenForever(streamFactory, dataConsumer);
    } catch (error) {
      // An error occurred so we reconnect to the stream. Note that we should
      // probably have retry logic here to prevent reconnection after a number of
      // closely timed failures (may indicate a problem that is not downstream).
      console.warn("Stream disconnected with error. Retrying.", error);
      listenForever(streamFactory, dataConsumer);
    }
  }

  async function loadTwitter() {
    const endPointParameters = {
      "tweet.fields": ["author_id", "conversation_id"],
      expansions: ["author_id", "referenced_tweets.id"],
      "media.fields": ["url"],
    };
    try {
      bot.log.warning("Setting up Twitter...");
      const body = {
        add: [
          { value: "from:" + process.env.TWITTER_USERNAME, tag: "from Me!!" },
        ],
      };
      const r = await T.post("tweets/search/stream/rules", body);
      //console.log(r);
    } catch (err) {
      console.log(err);
    }

    listenForever(
      () => T.stream("tweets/search/stream", endPointParameters),
      (data) => sendMessage(data, bot)
    );
  }

  loadTwitter().then(() => {
    bot.log.success("Connected to Twitter");
  });
};
