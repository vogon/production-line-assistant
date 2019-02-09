import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { taskCollapsed, taskExpanded, taskChangedCount, RootAction }
    from '../actions';
import { TaskState } from '../state';

type Props = {
    tasks: ReadonlyMap<string, TaskState>;
    thisTask: TaskState;
    depth: number;
    taskCollapsed: (id: string) => RootAction;
    taskExpanded: (id: string) => RootAction;
    taskChangedCount: (id: string, count: number) => RootAction;
};

class TaskComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private totalConstructionCost(): number {
        let totalCost = this.props.thisTask.archetype.constructionCost;

        for (let childTaskId of this.props.thisTask.archetype.subtaskIds) {
            totalCost += this.props.tasks.get(childTaskId)!.archetype.constructionCost;
        }

        return totalCost * this.props.thisTask.count;
    }

    private formatCost(cost: number): string {
        // thanks to https://stackoverflow.com/a/14428340 for this regex
        return `$${cost.toString().replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
    }

    private totalProcessTime(): number {
        let totalTime = this.props.thisTask.archetype.processTime;

        for (let childTaskId of this.props.thisTask.archetype.subtaskIds) {
            totalTime += this.props.tasks.get(childTaskId)!.archetype.processTime;
        }

        return totalTime;
    }

    private processTimeToSlotsPerHour(processTime: number): string {
        return (3600 / processTime * this.props.thisTask.count).toFixed(2);
    }

    private showExpandCollapseButton() {
        return this.props.thisTask.archetype.subtaskIds.length > 0;
    }

    render() {
        let headerButton;
        let taskId = this.props.thisTask.archetype.id;

        if (this.showExpandCollapseButton()) {
            if (this.props.thisTask.collapsed) {
                headerButton = <button type="button" className="btn btn-sm btn-success"
                    onClick={() => this.props.taskExpanded(taskId)}>+</button>;
            } else {
                headerButton = <button type="button" className="btn btn-sm btn-danger"
                    onClick={() => this.props.taskCollapsed(taskId)}>&ndash;</button>;
            }
        }

        let taskNameIndentStyle: React.CSSProperties = {
            marginLeft: `${this.props.depth}rem`
        };

        return <tr>
            <th scope="row" className="align-middle"><div style={taskNameIndentStyle}>
                {headerButton}
                &nbsp;{this.props.thisTask.archetype.friendlyName}
            </div></th>
            <td><input className="form-control" type="number"
                value={this.props.thisTask.count}
                onChange={(e) => this.props.taskChangedCount(taskId,
                    e.target.valueAsNumber)}></input></td>
            <td className="align-middle text-right">
                {this.formatCost(this.totalConstructionCost())}
            </td>
            <td className="align-middle text-right">
                {this.processTimeToSlotsPerHour(this.totalProcessTime())}
            </td>
        </tr>;
    }
}

const mapStateToProps = (_: any /*, ownProps*/) => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => 
    bindActionCreators({ taskCollapsed, taskExpanded, taskChangedCount }, dispatch);

export let Task = connect(mapStateToProps, mapDispatchToProps)(TaskComponent);