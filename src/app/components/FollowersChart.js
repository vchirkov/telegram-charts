import React, {Component} from 'react';

export class FollowersChart extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate({opts, data}) {
        return this.props.opts !== opts || this.props.data !== data;
    }

    render() {
        const {opts, data, name} = this.props;

        if (!opts || !data) {
            return (null);
        }
        return (
            <div className="chart">
                <h1>{name}</h1>
                <div ref={el => this.chart(el, data, opts)}/>
            </div>
        );
    }

    chart(container, data, opts) {
        if (!container) {
            return;
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const chart = new window.FollowersChart(data, opts);
        return container.appendChild(chart.getRoot());
    }
}
