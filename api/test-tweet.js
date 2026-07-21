import { tweet } from '../lib/twitterConfig.js';
import { twitterClient } from '../lib/twitterConfig.js';

export default async function handler(req, res) {
  const secret = req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const randomNum = Math.floor(Math.random() * 10000);
    const text = `تغريدة تجريبية لاختبار عمل البوت #${randomNum}`;
    
    await twitterClient.v2.tweet(text);

    return res.status(200).json({ 
      success: true, 
      message: 'تم إرسال التغريدة التجريبية بنجاح!',
      tweetText: text
    });
  } catch (error) {
    console.error('Twitter API Error:', error);
    let errorDetails = error.message;
    if (error.data) { errorDetails = error.data; }

    return res.status(500).json({ 
      success: false, 
      error: 'فشل إرسال التغريدة',
      details: errorDetails
    });
  }
}
