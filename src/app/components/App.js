import React, {Component} from 'react';

import {Settings} from "./Settings";
import {FollowersChart} from "./FollowersChart";
import {Readme} from "./Readme";

import data from '../resources/data.json';

export class App extends Component {
    state = {
        data,
        readme: false
    };

    render() {
        const {data, opts, readme} = this.state;
        const {width} = this.props;

        return <div className="app">
            <Settings initial={width}
                      apply={(opts) => this.apply(opts)}
                      openReadme={() => this.toggleReadme(true)}/>
            <Readme opened={readme} onClose={() => this.toggleReadme(false)}/>

            {data.map((chartData, i) => {
                return <FollowersChart key={i}
                                       data={chartData}
                                       opts={opts}
                                       name={`Chart #${i + 1}`}/>;
            })}
        </div>;
    }

    apply(opts) {
        this.setState(Object.assign({}, this.state, {opts}));
    }

    toggleReadme(readme) {
        this.setState(Object.assign({}, this.state, {readme}));
    }
}
