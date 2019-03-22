const data = require('./data');

data.forEach(chartData => {
    const c = new window.FollowersChart(chartData);
    document.body.appendChild(c.getRoot());
});

