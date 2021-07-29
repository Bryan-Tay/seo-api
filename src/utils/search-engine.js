import { chrome, puppeteer } from '../lib/browser';

export const simulateSearchEngine = async (url) => {
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
  
    let s = 'https://totheweb.com/learning_center/tools-search-engine-simulator/';
    await page.goto(s, {
      waitUntil: 'domcontentloaded',
    });
  
    // search for url
    await page.type('#url', url);
    await page.click('#submit');
  
    await page.waitForFunction("document.querySelector('#resultUrl') && document.querySelector('#resultUrl').innerText.length > 0");
    
    // get url
    const resultUrl = await page.$eval('#resultUrl', (el) => el.textContent);
    // get title
    const title = await page.$eval('#title', (el) => el.textContent);
    // get description
    const description = await page.$eval('#description', (el) => el.textContent);
    // get numberOfWords
    const numberOfWords = parseInt(await page.$eval('#numberOfWords', (el) => el.textContent));
    // get numberOfUniqueWords
    const numberOfUniqueWords = parseInt(await page.$eval('#numberOfUniqueWords', (el) => el.textContent));
    // get twoWordPhrases
    const twoWordPhrases = await page.$$eval('#twoWordPhrases div', (els) => els.map(el => ({
        word:  el.innerHTML.match(/(.*)<span>/)[1],
        counter: parseInt(el.innerHTML.match(/<span>(.*)<\/span>/)[1])
      })
    ));
    // get threeWordPhrases
    const threeWordPhrases = await page.$$eval('#threeWordPhrases div', (els) => els.map(el => ({
        word:  el.innerHTML.match(/(.*)<span>/)[1],
        counter: parseInt(el.innerHTML.match(/<span>(.*)<\/span>/)[1])
      })
    ));
  
    await browser.close();
  
    return {
      resultUrl,
      title,
      description,
      numberOfWords,
      numberOfUniqueWords,
      twoWordPhrases,
      threeWordPhrases
    };
  } catch (err) {
    console.log(err);
    return {
      resultUrl: '-',
      title: '-',
      description: '-',
      numberOfWords: 0,
      numberOfUniqueWords: 0,
      twoWordPhrases: [],
      threeWordPhrases: []
    };
  }
};
