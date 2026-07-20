import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
    appKey: process.env.consumer_key,
    appSecret: process.env.consumer_secret,
    accessToken: process.env.access_token,
    accessSecret: process.env.token_secret,
  });
  

 const twitterClient = client.readWrite;

  const tweet = async (text=` `) => {
    try {
        
        await twitterClient.v2.tweet(text);

    } catch (e) {
      console.log(e)
    }
  }

export {
    tweet , twitterClient 
}
