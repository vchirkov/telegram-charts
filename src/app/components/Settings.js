import 'react-dat-gui/build/react-dat-gui.css';
import React, {Component} from 'react';

import DatGui, {DatColor, DatNumber, DatButton} from 'react-dat-gui';

export class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            opts: Object.assign({}, window.FollowersChart.DEFAULTS, {
                width: props.initial
            })
        }
    }

    componentDidMount() {
        this.props.apply(this.state.opts);
    }

    render() {
        const {opts, collapsed} = this.state;
        const {apply} = this.props;

        if (!collapsed) {
            return (
                <DatGui data={opts} onUpdate={(opts) => this.setState({opts, collapsed})}>
                    <DatButton label='Open Readme'
                               onClick={() => this.onClickReadme()}/>
                    <DatButton label='Hide Configuration'
                               onClick={() => this.onClickHide()}/>

                    <DatNumber path='width' min={0} step={1}/>
                    <DatNumber path='chartHeight' min={0} step={1}/>
                    <DatNumber path='ticksX' min={0} step={1}/>
                    <DatNumber path='xAxisHeight' min={0} step={1}/>
                    <DatNumber path='xAxisTextOffset' step={1}/>
                    <DatNumber path='ticksY' min={0} step={1}/>
                    <DatNumber path='yAxisTicksTop' min={0} max={1} step={0.01}/>
                    <DatNumber path='yAxisTextOffset' step={1}/>
                    <DatNumber path='navHeight' min={0} step={1}/>
                    <DatNumber path='navControlWidth' min={0} step={1}/>
                    <DatNumber path='navControlBorderWidth' min={0} step={1}/>
                    <DatNumber path='navOverflowOpacity' min={0} max={1} step={0.01}/>
                    <DatNumber path='navControlsOpacity' min={0} max={1} step={0.01}/>
                    <DatColor path='navColor'/>
                    <DatNumber path='strokeWidth' min={0} step={1}/>
                    <DatNumber path='minInterval' min={0} max={1} step={0.01}/>

                    <DatButton label='Apply config'
                               onClick={() => apply(this.state.opts)}/>
                </DatGui>
            );
        } else {
            return (
                <DatGui data={{}} onUpdate={() => null}>
                    <DatButton label='Open Readme'
                               onClick={() => this.onClickReadme()}/>
                    <DatButton label='Show Configuration'
                               onClick={() => this.onClickShow()}/>
                </DatGui>
            );
        }
    }

    onClickReadme() {
        this.setState(Object.assign(this.state, {collapsed: true}));
        this.props.openReadme();
    }

    onClickHide() {
        this.setState(Object.assign(this.state, {collapsed: true}))
    }

    onClickShow() {
        this.setState(Object.assign(this.state, {collapsed: false}))
    }
}
