import React, {Component} from 'react';

import {Settings} from "./Settings";
import {FollowersChart} from "./FollowersChart";
import {Readme} from "./Readme";
import {Nightmode} from "./Nightmode";

import data from '../resources/data.json';

export class App extends Component {
    state = {
        data,
        readme: false,
        night: false
    };

    render() {
        const {data, opts, readme, night} = this.state;
        const {width} = this.props;

        return (
            <>
                <Nightmode night={night} onClick={() => this.toggleNight()}/>
                <Settings initial={width}
                          apply={(opts) => this.apply(opts)}
                          openReadme={() => this.toggleReadme(true)}/>
                <Readme opened={readme} onClose={() => this.toggleReadme(false)}/>
                <div className="chart-list">
                    {data.map((chartData, i) => {
                        return <FollowersChart key={i}
                                               data={chartData}
                                               opts={opts}
                                               nightMode={night}
                                               name={`Chart #${i + 1}`}/>;

                    })}
                </div>
            </>
        );
    }

    apply(opts) {
        this.setState(Object.assign({}, this.state, {opts}));
    }

    toggleReadme(readme) {
        this.setState(Object.assign({}, this.state, {readme}));
    }

    toggleNight() {
        this.setState(Object.assign({}, this.state, {night: !this.state.night}));
    }
}
