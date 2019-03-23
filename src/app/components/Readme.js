import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import readme from '../../../README.md';
import marked from 'marked';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export class Readme extends React.Component {
    render() {
        const {opened, onClose} = this.props;

        return (
            <Dialog
                fullScreen
                open={opened}
                onClose={onClose}
                TransitionComponent={Transition}>
                <AppBar>
                    <Toolbar className="readme-toolbar">
                        <IconButton color="inherit" onClick={onClose}>
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div className="container"
                     dangerouslySetInnerHTML={{__html: marked(readme)}}>
                </div>
            </Dialog>
        );
    }
}
