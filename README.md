# seochanges-api

This is the back-end for seochanges repository and has 3 main endpoints.

## PageSpeed Insights

Get PageSpeed Insights and Core Web Vitals scores for given url and device.

#### Request

```http
GET /api/pagespeed-insights?url=[URL]&device=[DEVICE]
```

| Parameter | Type     | Description                                      |
| :-------- | :------- | :----------------------------------------------- |
| `url`     | `string` | **Required**. URL to get scores                  |
| `device`  | `string` | **Required**. Desired device (mobile or desktop) |

#### Response

The endpoint returns a JSON object with pagespeed insights score, device and core web vitals.

```javascript
{
  "score" : number,
  "device" : string,
  "web_vitals" : {
    "lcp" : string,
    "fid" : string,
    "cls" : string
  }
}
```

The `score` attribute contains a the overall score for the given url, the result comes from lighthouse service.

The `device` attribute indicates the device that was tested for getting the score (movile or desktop).

The `web_vitals` attribute contains core web vital scores (SLOW, AVERAGE or FAST) for main 3 indicators:

- lcp: Largest Contentful Paint
- fid: First Input Delay
- cls: Cumulative Layout Shift

## KwFinder Credit Balance

Crawl kwfinder wbsite to get the current credit balance.

#### Request

```http
GET /api/remaining-credits
```

#### Response

The endpoint returns a JSON object with remaining credits from kwfinder.

```javascript
{
  "kw" : {
    "remaining" : number,
    "total" : number,
  },
  "serp" : {
    "remaining" : number,
    "total" : number,
  },
  "sp" : {
    "remaining" : number,
    "total" : number,
  },
  "links" : {
    "remaining" : number,
    "total" : number,
  },
  "ttr" : string
}
```

The `kw`, `serp`, `sp` and `links` attributes contain the remaining and total credits from each service.

The `ttr` attribute indicates Time to Reset leyend from kwfinder.

## Search Engine Simulator

Get metadata and top phrases for a given url.

#### Request

```http
GET /api/search-engine-simulator?url=[URL]
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `url`     | `string` | **Required**. URL to get data from |

#### Response

The endpoint returns a JSON object with metadata, 2 word phrases and 3 word phrases for the given url.

```javascript
{
  "resultUrl" : string,
  "title" : string,
  "description" : string,
  "numberOfWords" : string,
  "numberOfUniqueWords" : string,
  "twoWordPhrases" : {
    "word" : string,
    "counter" : number
  },
  "threeWordPhrases" : {
    "word" : string,
    "counter" : number
  }
}
```

The `resultUrl` attribute contains the requested URL.

The `title` attribute contains the website title.

The `description` attribute contains the website description.

The `numberOfWords` attribute contains the total number of words for the website.

The `numberOfUniqueWords` attribute contains the total number of unique words for the website.

The `twoWordPhrases` and `threeWordPhrases` attributes contains a list of phrases sorted by frequency.
