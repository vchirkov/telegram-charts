import React, {Component} from 'react';

export class FollowersChart extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate({opts, data, nightMode}) {
        if (this.props.nightMode !== nightMode && this.followersChart) {
            this.followersChart.update({nightMode});
        }
        return this.props.opts !== opts || this.props.data !== data;
    }

    render() {
        const {opts, data, name, nightMode} = this.props;

        if (!opts || !data) {
            return (null);
        }
        return (
            <div className="chart">
                <h1>{name}</h1>
                <div ref={el => this.chart(el, data, opts, nightMode)}/>
            </div>
        );
    }

    chart(container, data, opts, nightMode) {
        if (!container) {
            return;
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        this.followersChart = new window.FollowersChart(data, opts);
        this.followersChart.update({nightMode});
        return container.appendChild(this.followersChart.getRoot());
    }
}
