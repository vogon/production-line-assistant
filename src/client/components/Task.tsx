import * as React from 'react';
import { connect } from 'react-redux';
import { TaskState } from '../state';

type Props = {
    tasks: ReadonlyMap<string, TaskState>;
    thisTask: TaskState;
}

class TaskComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    private totalConstructionCost(): number {
        let totalCost = this.props.thisTask.archetype.constructionCost;

        for (let childTaskId of this.props.thisTask.archetype.subtaskIds) {
            totalCost += this.props.tasks.get(childTaskId)!.archetype.constructionCost;
        }

        return totalCost;
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
        return (3600 / processTime).toFixed(2);
    }

    render() {
        return <tr>
            <th scope="row" className="align-middle"><div>
                <button type="button" className="btn btn-sm btn-success">+</button>
                &nbsp;{this.props.thisTask.archetype.friendlyName}
            </div></th>
            <td><input className="form-control" type="number"
                value={this.props.thisTask.count}></input></td>
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

const mapDispatchToProps = { };

export let Task = connect(mapStateToProps, mapDispatchToProps)(TaskComponent);