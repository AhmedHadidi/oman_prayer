import dotenv from "dotenv";
dotenv.config();
import { getTimeLikeTheApi} from "./helper.js";
import {getCurrentDayAndMonth, getTime } from "./getTime.js";

import schedule from "node-schedule";

import { tweet } from "./twitterConfig.js";

const schedulePreyTime = async () => {
  console.log(`main function schedulePreyTime works`);

  const arabicTimingsPrey = await getTime();

 const { dayOfWeek, month , year } = getCurrentDayAndMonth();

  for (const prey in arabicTimingsPrey) {
    const hour = +arabicTimingsPrey[prey].split(`:`)[0];
    const minute = +arabicTimingsPrey[prey].split(`:`)[1];


    schedule.scheduleJob(
      {
        hour,
        minute,
        dayOfWeek ,
        month , 
        year ,
        tz: `Asia/Muscat`,
      },
      async () => {
        //////////////////////
        console.log(`  ------------------time to prey----------`);
        //////////////////////
        const dateLikeApi = getTimeLikeTheApi();

        
          tweet(`حان الآن موعد أذان ${prey} ${dateLikeApi}  حسب التوقيت المحلي لمحافظة مسقط وضواحيها، وعلى القاطنين خارج المحافظة مراعاة فارق التوقيت.
#عمان #مسقط
#أوقات_الصلاة`);
        
        console.log(`prey time `);
        /////////////////////
      }
    );
  }

  setTimeout(schedulePreyTime, 24 * 60 * 60 * 1000);
};

schedulePreyTime();
