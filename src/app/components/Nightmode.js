import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import {Brightness2, Brightness5} from '@material-ui/icons';

export class Nightmode extends React.Component {
    componentDidUpdate() {
        if (this.props.night) {
            document.body.classList.add('night');
        } else {
            document.body.classList.remove('night');
        }
    }

    render() {
        const {night, onClick} = this.props;

        return (
            <IconButton className="night-mode-control"
                        color="inherit"
                        onClick={onClick}>
                {night ? <Brightness2 color="secondary"/> : <Brightness5/>}
            </IconButton>
        );
    }
}
