# Telegram Charts

Telegram Followers chart for Telegram Developer Contest

## Getting Started

Library has absolutely no external dependencies and consists of two files:

`./lib.js` - **7.41 kB** gzip  
`./lib.css` - **945 B** gzip

Demo build exposes `FollowersChart` as global variable, although can be rebuild for UMD/CommonJS/ES6 imports/etc. as being assembled by Webpack.

## Usage

Include required files:

```html
<head>
  <script type="text/javascript" src="lib.js"></script>
  <link href="lib.css" rel="stylesheet">
</head>

```

Make new instance of `Followers Chart`:

```js
const chart = FollowersChart(data, opts);
document.body.appendChild(chart.getRoot());
```
### Data:
* **data.columns**  
List of all data columns in the chart. Each column has its label at position 0, followed by values.  
x values are UNIX timestamps in milliseconds.
  
* **data.types**  
Chart types for each of the columns. Supported values:  
  "line" (line on the graph with linear interpolation),  
  "x" (x axis values for each of the charts at the corresponding positions).
  
* **data.colors**  
Color for each line in 6-hex format (e.g. "#AAAAAA").

* **data.names**  
Names for each line.

### Opts:
* **width** (`default:600`, `min:0`)  
Whole Followers Chart width, set in pixels

* **chartHeight** (`default:400`, `min:0`)  
Height of Chart block, set in pixels

* **xAxisHeight** (`default:30`, `min:0`)  
Height of `AxisX` block, set in pixels.
  > Bigger Value -> More Space between `Chart` and `Navigation`

* **xAxisTextOffset** (`default:20`)  
Offset of `AxisX` text, set in pixels. 
  > Bigger Value -> Lower Text

* **yAxisTicksTop** (`default:0.9`, `min:0`, `max:1`)  
Top Border for `AxisY` values rendered. 

* **yAxisTextOffset** (`default:6`)  
Offset of `AxisY` text, set in pixels. 
  > Bigger Value -> Higher Text

* **navHeight** (`default:80`, `min:0`)  
Height of `Navigation` panel, set in pixels.

* **navControlWidth** (`default:8`, `min:0`)  
Width of `Navigation` extend/shrink controls, set in pixels.

* **navControlBorderWidth** (`default:2`, `min:0`)  
Width of `Navigation` slide control border, set in pixels.

* **navOverflowOpacity** (`default:0.04`, `min:0`, `max:1`)  
Opacity of `Navigation` hidden area.

* **navControlsOpacity** (`default:0.12`, `min:0`, `max:1`)  
Opacity of `Navigation` extend, shrink slide area.

* **navColor** (`default:'#30A3F0'`, `supports: valid css colors`)  
Color of `Navigation` panel.

* **strokeWidth** (`default:2`, `min:0`)  
Stroke Width of `Chart` and `Navigation` lines, set in pixels.

* **ticksX** (`default:5`, `min:0`)  
Target Number of ticks for `AxisX`.  
  > Exact number of ticks is not guaranteed and can vary on +-50% based on conditions 

* **ticksY** (`default:5`, `min:0`)  
Target Number of ticks for `AxisY`.  
  > Exact number of ticks is not guaranteed and can vary on +-50% based on conditions 

* **intervalStart** (`default:0.75`, `min:0`, `max:1`)  
Initial position of Start extend/shrink control.

* **intervalEnd** (`default:1`, `min:0`, `max:1`)  
Initial position of End extend/shrink control.

* **minInterval** (`default:0.15`, `min:0.01`, `max:1`)  
Minimum interval between Start and End extend/shrink control.

* **nightMode** (`default:false` `supports: boolean`)  
Sets FollowersChart night mode state.

## Tested on

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br> Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Samsung |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| last 3 versions| last 3 versions| supported | supported | last 3 versions

Browser Support can be improved by adding several polyfills.

## Author

* **Vlad Chirkov** - [GitHub](https://github.com/vchirkov) | [Linkedin](https://www.linkedin.com/in/vchirkov/) | [Email](mailto:vlad.chirkou@gmail.com)
