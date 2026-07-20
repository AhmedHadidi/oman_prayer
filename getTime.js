import axios from "axios";
import cheerio from "cheerio";
import https from "https";
import moment from 'moment-timezone';


const getTime = async () => {
  // URL to the website to be scraped
  const url = "https://www.mara.gov.om/arabic/calendar_page4.asp";

  // Send an HTTP GET request to the website

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });
  try {
    let response = await axios.get(url, { httpsAgent: agent });
    // Load the HTML document into Cheerio
    const $ = cheerio.load(response.data);

    // Target the second <tr> element inside the <tbody> element and select the <td> elements inside it
    let output = {
      Fajr: ``,
      Dhuhr: ``,
      Asr: ``,
      Maghrib: ``,
      Isha: ``,
  
    };
    $("tbody tr:nth-child(2) td").each((i, element) => {
      const data = $(element).text().trim();
      i == 1
        ? (output[`Fajr`] = data)
        : i == 3
        ? (output[`Dhuhr`] = data)
        : i == 4
        ? (output[`Asr`] = data)
        : i == 5
        ? (output[`Maghrib`] = data)
        : i == 6
        ? (output[`Isha`] = data)
        : null;
    });

    return output;
  } catch (error) {
    console.log(error);
  }
};



//////////////////////////////////////////////////////////////////////////
function getCurrentDayAndMonth() {
  // Get the current date and time in the "Asia/Muscat" timezone
  const now = moment().tz('Asia/Muscat');

  // Get the day of the week and month in the range of 0 to 6 and 0 to 11 respectively
  const dayOfWeek = now.day();
  const month = now.month();
  const year = now.year();

  return { dayOfWeek, month  ,year };
}



console.log(await getTime())

export {getCurrentDayAndMonth , getTime}