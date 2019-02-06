import * as React from 'react';
import { connect } from 'react-redux';

import { RootState } from '../state';
import { TaskList } from './TaskList';

class AppComponent extends React.Component<ReturnType<typeof mapStateToProps>> {
    render() {
        return <TaskList tasks={this.props.tasks} />;
    }
}

const mapStateToProps = (state: RootState /*, ownProps*/) => {
    return {
        tasks: state.tasks
    };
};

const mapDispatchToProps = { };

export let App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);