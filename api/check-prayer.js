import { getTime } from '../lib/getTime.js';
import { getTimeLikeTheApi, arabicTimings } from '../lib/helper.js';
import { tweet } from '../lib/twitterConfig.js';
import moment from 'moment-timezone';

export default async function handler(req, res) {
  // ======== Security: Verify the request is from our cron service ========
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // ======== Get current time in Oman timezone ========
    const now = moment().tz('Asia/Muscat');
    const currentHour = now.hour();
    const currentMinute = now.minute();
    const currentTime = `${currentHour}:${String(currentMinute).padStart(2, '0')}`;

    console.log(`[check-prayer] Current Oman time: ${currentTime}`);

    // ======== Fetch prayer times from the Ministry website ========
    const timings = await getTime();

    if (!timings || Object.values(timings).every(v => !v)) {
      console.log('[check-prayer] Failed to fetch prayer times');
      return res.status(500).json({ error: 'Failed to fetch prayer times from source' });
    }

    // ======== Convert to Arabic prayer names (handles Friday -> الجمعة) ========
    const arabicPrayerTimes = arabicTimings(timings);

    console.log(`[check-prayer] Prayer times today:`, arabicPrayerTimes);

    // ======== Check if current time matches any prayer time ========
    let tweeted = false;
    let matchedPrayer = null;

    // Prayer names that are in PM (afternoon/evening) - need +12 hour conversion
    // The website returns times in 12-hour format without AM/PM indicator
    // Fajr is always early morning (AM) - no conversion needed
    // Dhuhr is around noon (12:xx) - already correct in 24h format
    // Asr, Maghrib, Isha are PM - need +12 hours
    const pmPrayers = ['العصر', 'المغرب', 'العشاء'];

    for (const [prayerName, time] of Object.entries(arabicPrayerTimes)) {
      if (!time || time === 'N/A') continue;

      let [hour, minute] = time.split(':').map(Number);

      // Convert 12h -> 24h for afternoon/evening prayers
      if (pmPrayers.includes(prayerName) && hour < 12) {
        hour += 12;
      }

      if (hour === currentHour && minute === currentMinute) {
        console.log(`[check-prayer] 🕌 Prayer time match! ${prayerName} at ${hour}:${String(minute).padStart(2, '0')} (24h)`);

        const dateLikeApi = getTimeLikeTheApi();

        await tweet(
          `حان الآن موعد أذان ${prayerName} ${dateLikeApi}  حسب التوقيت المحلي لمحافظة مسقط وضواحيها، وعلى القاطنين خارج المحافظة مراعاة فارق التوقيت.\n#عمان #مسقط\n#أوقات_الصلاة`
        );

        tweeted = true;
        matchedPrayer = prayerName;
        console.log(`[check-prayer] ✅ Tweet sent for ${prayerName}`);
      }
    }

    // ======== Return response ========
    return res.status(200).json({
      success: true,
      currentTime,
      tweeted,
      matchedPrayer,
      prayerTimes: arabicPrayerTimes,
      timestamp: now.format('YYYY-MM-DD HH:mm:ss Z'),
    });

  } catch (error) {
    console.error('[check-prayer] Error:', error);
    return res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
