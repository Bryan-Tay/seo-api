import { chrome, puppeteer } from "../lib/browser";

const parseCredits = (text) => {
  let [remaining, total] = String(text).split('/');
  try {
    remaining = Number(remaining.replace(/\D/g, ''));
    total = Number(total.replace(/\D/g, ''));
  } catch (err) {
    remaining = null;
    total = null;
  }
  return { remaining, total };
};

export const getCredits = async () => {
  let ttr = 'Fully charged';
  let kw = { remaining: 1000, total: 1000 };
  let serp = { remaining: 1000, total: 1000 };
  let sp = { remaining: 0, total: 0 };
  let links = { remaining: 0, total: 0 };

  try {
    const browser = await puppeteer.launch({
      headless: true,
      devtools: false,
      defaultViewport: { width: 1240, height: 800 },
      args: [...chrome.args, '--window-size=1240,800'],
      executablePath: chrome ? await chrome.executablePath : null,
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const invalidTypes = ['image', 'stylesheet', 'font'];
      if (invalidTypes.indexOf(request.resourceType()) > -1) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto('https://mangools.com/users/sign_in', {
      waitUntil: 'domcontentloaded',
    });

    // sign in
    await page.type('#user_email', process.env.KWFINDER_USER);
    await page.type('#user_password', process.env.KWFINDER_PASS);
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // get keyword lookups credits
    const kwLimitEl = await page.waitForSelector('.kw-limit');
    const kwLimit = await kwLimitEl.evaluate((el) => el.textContent);
    kw = parseCredits(kwLimit);
    // get serp lookups credits
    const serpLimitEl = await page.waitForSelector('.serp-limit');
    const serpLimit = await serpLimitEl.evaluate((el) => el.textContent);
    serp = parseCredits(serpLimit);
    // get site lookups credits
    const spLimitEl = await page.waitForSelector('.sp-limit');
    const spLimit = await spLimitEl.evaluate((el) => el.textContent);
    sp = parseCredits(spLimit);
    // get backlink rows credits
    const linksLimitEl = await page.waitForSelector('.links-limit');
    const linksLimit = await linksLimitEl.evaluate((el) => el.textContent);
    links = parseCredits(linksLimit);
    // get time to reset
    const ttrEl = await page.waitForSelector('.kw-limit-reset');
    ttr = await ttrEl.evaluate((el) => el.textContent);

    await browser.close();
  } catch (err) {
    console.log(err);
  }

  return { kw, serp, sp, links, ttr };
};
