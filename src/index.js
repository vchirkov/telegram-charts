import data from './data/chart_data';
import {FollowersChart} from "./FollowersChart";

const chart = data[0];

const c = new FollowersChart(chart, 600, 400);
document.body.appendChild(c.svg);
