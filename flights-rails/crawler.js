const puppeteer = require('puppeteer-firefox');

async function run(page, date, sleepMore) {
  if (sleepMore) {
    console.log("等待两分钟......");
    await page.waitFor(120000);
  }

  await page.goto('https://www.united.com/ual/en/us/flight-search/book-a-flight');

  await page.evaluate(() => {
    const ow = document.querySelector("#TripTypes_ow");
    ow.click();

    document.querySelector('#Trips_0__Origin').value = '';
    document.querySelector('#Trips_0__Destination').value = '';
    document.querySelector('#Trips_0__DepartDate').value = '';
  })

  await page.type('#Trips_0__Origin', 'SFO', {delay: 100});
  await page.type('#Trips_0__Destination', 'PVG', {delay: 100});
  await page.type('#Trips_0__DepartDate', date, {delay: 100});
  await page.click("#Trips_0__NonStop");

  try {
    await page.evaluate(() => {
      const btn = document.querySelector("#btn-search")
      btn.click()
    })
    await page.waitFor(3000);
    await page.waitForSelector("#fl-results");

    // verify if the result exists: flight-result-list
    await Promise.race([
      page.waitForSelector("#fl-results .flight-result-list"),
      page.waitForSelector("#fl-results .icon-validation-summary")
    ]);

    //page.on('console', consoleObj => console.log(consoleObj.text()));
    const priceList = await page.evaluate(resultList => {
      const notFoundIcon = document.querySelectorAll("#fl-results .icon-validation-summary");
      if (notFoundIcon.length == 1) {
        resultList.push("无票");
      }
      else {
        const priceText = document.querySelectorAll("#fl-results .price-point")[0];
        resultList.push(priceText.innerText);
      }
      return resultList;
    }, []);
    console.log(priceList[0]);
  }
  finally {
    await page.screenshot({path: date + '.png'});
  }
}

async function initPage(browser) {
  const page = await browser.newPage();
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0';
  await page.setUserAgent(userAgent);

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query;
    return window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
  });

  return page;
}

async function main() {
  var sleep = false;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
    //slowMo: 100
  });

  var dayOfWeek = {
    "Aug 10, 2020": 1,
    "Aug 11, 2020": 2,
    "Aug 12, 2020": 3,
    "Aug 13, 2020": 4,
    "Aug 14, 2020": 5,
    "Aug 15, 2020": 6,
    "Aug 16, 2020": 7,
    "Aug 17, 2020": 1,
    "Aug 18, 2020": 2,
    "Aug 19, 2020": 3,
    "Aug 20, 2020": 4,
    "Aug 21, 2020": 5,
    "Aug 22, 2020": 6,
    "Aug 23, 2020": 7,
    "Aug 24, 2020": 1,
    "Aug 25, 2020": 2,
    "Aug 26, 2020": 3,
    "Aug 27, 2020": 4,
    "Aug 28, 2020": 5,
    "Aug 29, 2020": 6,
    "Aug 30, 2020": 7,
    "Aug 31, 2020": 1,
    "Sep 1, 2020" : 2,
    "Sep 2, 2020" : 3,
    "Sep 3, 2020" : 4,
    "Sep 4, 2020" : 5,
    "Sep 5, 2020" : 6,
    "Sep 6, 2020" : 7,
    "Sep 7, 2020" : 1,
    "Sep 8, 2020" : 2,
    "Sep 9, 2020" : 3,
    "Sep 10, 2020": 4,
    "Sep 11, 2020": 5,
    "Sep 12, 2020": 6,
    "Sep 13, 2020": 7,
    "Sep 14, 2020": 1,
    "Sep 15, 2020": 2,
    "Sep 16, 2020": 3,
    "Sep 17, 2020": 4,
    "Sep 18, 2020": 5,
    "Sep 19, 2020": 6,
    "Sep 20, 2020": 7,
    "Sep 21, 2020": 1,
    "Sep 22, 2020": 2,
    "Sep 23, 2020": 3,
    "Sep 24, 2020": 4,
    "Sep 25, 2020": 5,
    "Sep 26, 2020": 6,
    "Sep 27, 2020": 7,
    "Sep 28, 2020": 1,
    "Sep 29, 2020": 2,
    "Sep 30, 2020": 3,
    "Oct 1, 2020" : 4,
    "Oct 2, 2020" : 5,
    "Oct 3, 2020" : 6,
    "Oct 4, 2020" : 7,
    "Oct 5, 2020" : 1,
    "Oct 6, 2020" : 2,
    "Oct 7, 2020" : 3,
    "Oct 8, 2020" : 4,
    "Oct 9, 2020" : 5,
  };

  const page = await initPage(browser);

  console.log("<br/>");
  const date = new Date();
  const timezone =  {timeZone: 'America/Los_Angeles'};
  console.log(date.toLocaleDateString('en-US', timezone) + " " + date.toLocaleTimeString('en-US', timezone));
  console.log("<br/>");

  for (let idx = 10; idx <= 31; idx++) {
    try {
      var dateStr = "Aug " + idx + ", 2020";
      const curDate = new Date();
      console.log("==== " + dateStr + "(" + dayOfWeek[dateStr]  + ")==" + curDate.toLocaleTimeString('en-US', timezone) + "==<br/>")
      await run(page, dateStr, sleep);
      sleep = false;
    } catch (err) {
      //console.log(err);
      console.log("搜索出错");
      sleep = true;
    }
    console.log("<br/>");
  }

  for (let idx = 1; idx <= 30; idx++) {
    try {
      var dateStr = "Sep " + idx + ", 2020";
      const curDate = new Date();
      console.log("==== " + dateStr + "(" + dayOfWeek[dateStr]  + ")==" + curDate.toLocaleTimeString('en-US', timezone) + "==<br/>")
      await run(page, dateStr, sleep);
      sleep = false;
    } catch (err) {
      //console.log(err);
      console.log("搜索出错");
      sleep = true;
    }
    console.log("<br/>");
  }

  for (let idx = 1; idx <= 9; idx++) {
    try {
      var dateStr = "Oct " + idx + ", 2020";
      const curDate = new Date();
      console.log("==== " + dateStr + "(" + dayOfWeek[dateStr]  + ")==" + curDate.toLocaleTimeString('en-US', timezone) + "==<br/>")
      await run(page, dateStr, sleep);
      sleep = false;
    } catch (err) {
      //console.log(err);
      console.log("搜索出错");
      sleep = true;
    }
    console.log("<br/>");
  }

  await page.close();
  await browser.close();
}

main();