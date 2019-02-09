import * as React from 'react';
import { connect } from 'react-redux';

import { TaskState } from '../state';
import { Task } from './Task';

type Props = {
    tasks: ReadonlyMap<string, TaskState>
};

class TaskListComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        let visibleTasks: { state: TaskState, depth: number }[] = [];
        let self = this;

        function displayVisibleSubtree(task: TaskState, rootDepth: number) {
            visibleTasks.push({ state: task, depth: rootDepth });

            if (!task.collapsed) {
                for (let subtaskId of task.archetype.subtaskIds) {
                    displayVisibleSubtree(self.props.tasks.get(subtaskId)!,
                        rootDepth + 1);
                }
            }
        }

        for (let task of this.props.tasks.values()) {
            if (task.archetype.parentId === null) {
                displayVisibleSubtree(task, 0);
            }
        }

        return <form>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th className="col-sm-4" scope="col">station name</th>
                        <th className="col-sm-1 text-center" scope="col"># slots</th>
                        <th className="col-sm-1 text-right" scope="col">total cost</th>
                        <th className="col-sm-1 text-right" scope="col">slots/hour</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleTasks.map((task) =>
                        <Task tasks={this.props.tasks} thisTask={task.state}
                            depth={task.depth} />
                    )}
                </tbody>
            </table>
        </form>;
    }
}

const mapStateToProps = (_: any /*, ownProps*/) => {
    return {};
};

const mapDispatchToProps = { };

export let TaskList = connect(mapStateToProps, mapDispatchToProps)(TaskListComponent);