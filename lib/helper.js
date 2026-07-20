function getDateInSchema() {
  // Create a new Date object
  var currentDate = new Date();

  // Get the options for formatting the date string
  var options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: `Asia/Muscat`
  };

  // Format the date string using the specified timezone
  var dateString = currentDate.toLocaleDateString('en-US', options).replace(/\//g, '-').split('-')

  return `${dateString[1]}-${dateString[0]}-${dateString[2]}`;
}

///////////////////////////////////////////////////////////////////////////////////////////
function isTodayFriday() {
  // Check Friday in Oman timezone
  const now = new Date();
  const omanDay = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Muscat' }));
  return omanDay.getDay() === 5;
}

const arabicTimings = (timingsEnglish) => {
  if (isTodayFriday()) {
    return {
      الفجر: timingsEnglish["Fajr"]?.toString() || "N/A",
      الجمعة: timingsEnglish["Dhuhr"]?.toString() || "N/A",
      العصر: timingsEnglish["Asr"]?.toString() || "N/A",
      المغرب: timingsEnglish["Maghrib"]?.toString() || "N/A",
      العشاء: timingsEnglish["Isha"]?.toString() || "N/A",  
    };
  } else {
    return {
      الفجر: timingsEnglish["Fajr"]?.toString() || "N/A",
      الظهر: timingsEnglish["Dhuhr"]?.toString() || "N/A",
      العصر: timingsEnglish["Asr"]?.toString() || "N/A",
      المغرب: timingsEnglish["Maghrib"]?.toString() || "N/A",
      العشاء: timingsEnglish["Isha"]?.toString() || "N/A",

    };
  }
};

///////////////////////////////////////////////////////////////////////////////////////////

const getTimeLikeTheApi = () => {
  let date = new Date();
  let timeZone = "Asia/Muscat";
  let options = { timeZone: timeZone, hour12: true };
  let timeString = date
    .toLocaleTimeString("en-US", options)
    .replace(/:\d+ /, " ");
  timeString = timeString.replace(/PM/g, "مساءً").replace(/AM/g, "صباحاً");
  return timeString;
};


//////////
export {
  getDateInSchema,
  arabicTimings,
  getTimeLikeTheApi,
};
