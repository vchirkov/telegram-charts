const {FollowersChart} = require('./FollowersChart/FollowersChart');

//assumption: data fetch mechanism is a temporary solution
// to avoid server requests and additional lib file size

data.forEach(chartData => {
    const c = new FollowersChart(chartData);
    document.body.appendChild(c.getRoot());
});

