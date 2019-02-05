import * as React from 'react';
import { connect } from 'react-redux';
import { TaskState } from '../state';

type Props = {
    task: TaskState;
}

class TaskComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return <tr>
            <th scope="row" className="align-middle"><div>
                <button type="button" className="btn btn-sm btn-success">+</button>
                {this.props.task.archetype.friendlyName}
            </div></th>
            <td><input className="form-control" type="number"
                value={this.props.task.count}></input></td>
            <td className="align-middle text-right">
                {this.props.task.archetype.constructionCost}
            </td>
            <td className="align-middle text-right">
                {this.props.task.archetype.processTime}
            </td>
        </tr>;
    }
}

const mapStateToProps = (_: any /*, ownProps*/) => {
    return {};
};

const mapDispatchToProps = { };

export let Task = connect(mapStateToProps, mapDispatchToProps)(TaskComponent);