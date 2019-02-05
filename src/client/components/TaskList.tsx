import * as React from 'react';
import { connect } from 'react-redux';

import { TaskState } from '../state';
import { Task } from './Task';

type Props = {
    tasks: ReadonlyArray<TaskState>
};

class TaskListComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return <form>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th className="col-sm-4" scope="col">station name</th>
                        <th className="col-sm-1 text-center" scope="col"># slots</th>
                        <th className="col-sm-1 text-right" scope="col">total cost</th>
                        <th className="col-sm-1 text-right" scope="col">slots/hour</th>
                    </tr>
                    {this.props.tasks.map((task) =>
                        <Task task={task} />
                    )}
                </thead>
            </table>
        </form>;
    }
}

const mapStateToProps = (_: any /*, ownProps*/) => {
    return {};
};

const mapDispatchToProps = { };

export let TaskList = connect(mapStateToProps, mapDispatchToProps)(TaskListComponent);