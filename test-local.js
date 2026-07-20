/**
 * Local test script to verify the check-prayer endpoint logic
 * Run with: node api/test-local.js
 * 
 * This simulates what cron-job.org will do:
 * calls the check-prayer logic and shows what would happen
 */
import dotenv from 'dotenv';
dotenv.config();

import { getTime } from '../lib/getTime.js';
import { getTimeLikeTheApi, arabicTimings } from '../lib/helper.js';
import moment from 'moment-timezone';

async function testLocally() {
  console.log('=== اختبار محلي لبوت أوقات الصلاة ===\n');

  // Get current Oman time
  const now = moment().tz('Asia/Muscat');
  const currentHour = now.hour();
  const currentMinute = now.minute();
  const currentTime = `${currentHour}:${String(currentMinute).padStart(2, '0')}`;

  console.log(`⏰ الوقت الحالي في مسقط: ${currentTime}`);
  console.log(`📅 التاريخ: ${now.format('YYYY-MM-DD')}`);
  console.log(`📅 اليوم: ${now.format('dddd')}`);
  console.log('');

  // Fetch prayer times
  console.log('🔄 جاري جلب أوقات الصلاة من موقع وزارة الأوقاف...');
  
  try {
    const timings = await getTime();
    console.log('✅ أوقات الصلاة (خام):', timings);
    console.log('');

    // Convert to Arabic
    const arabicPrayerTimes = arabicTimings(timings);
    const pmPrayers = ['العصر', 'المغرب', 'العشاء'];
    
    console.log('🕌 أوقات الصلاة (عربي) - بصيغة 24 ساعة:');
    for (const [name, time] of Object.entries(arabicPrayerTimes)) {
      let [hour, minute] = time.split(':').map(Number);
      if (pmPrayers.includes(name) && hour < 12) {
        hour += 12;
      }
      const time24 = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const isNow = (hour === currentHour && minute === currentMinute);
      console.log(`   ${name}: ${time} → ${time24} ${isNow ? '⬅️ حان الآن!' : ''}`);
    }
    console.log('');

    // Show what the tweet would look like
    const dateLikeApi = getTimeLikeTheApi();
    console.log('📝 نموذج التغريدة:');
    console.log(`   "حان الآن موعد أذان [اسم_الصلاة] ${dateLikeApi}  حسب التوقيت المحلي لمحافظة مسقط وضواحيها، وعلى القاطنين خارج المحافظة مراعاة فارق التوقيت."`);
    console.log('');
    console.log('✅ الاختبار تم بنجاح! كل شيء يعمل.');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

testLocally();
