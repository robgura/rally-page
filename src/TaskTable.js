/*global React */

import {
    getBlockedHtml,
    getLink,
    taskSort,
    ownerIfKnown,
} from './util.js';

export default function TaskTable(props) {

    const {
        model,
    } = props;

    const [tasks, setTasks] = React.useState({
        state: 'init',
        records: [],
    });

    React.useEffect(() => {
        if (tasks.state === 'init' && model.canHaveTasks() && model.data.Tasks.Count > 0) {
            setTasks({
                ...tasks,
                state: 'pending',
            });
            model.getCollection('Tasks').load({
                fetch: [
                    'Blocked',
                    'BlockedReason',
                    'DisplayName',
                    'Estimate',
                    'Estimate',
                    'FormattedId',
                    'Name',
                    'Owner',
                    'State',
                    'UserName',
                ],
                callback: function(records, _operation, _success) {
                    setTasks({
                        state: 'success',
                        records,
                    });
                }
            });
        }
    }, [setTasks, tasks]);

    const renderTasks = () => {
        return tasks.records
            .filter((tt) => {
                if (tt.data.State === 'Defined' || tt.data.State === 'In-Progress') {
                    return true;
                }
                if (tt.data.Blocked) {
                    return true;
                }
                return false;
            })
            .sort(taskSort)
            .map((tt) => {
                let className = '';
                if (tt.data.Blocked) {
                    className = 'blocked';
                }
                return (
                    <tr className={className} key={tt.data.FormattedID} >
                        <td>
                           <a href={getLink(tt)} > {tt.data.FormattedID} </a>
                        </td>
                        <td>
                            {tt.data.Name}
                        </td>
                        <td>
                            {tt.data.Estimate}
                        </td>
                        <td>
                            {tt.data.State}
                        </td>
                        <td>
                            {getBlockedHtml(tt.data)}
                        </td>
                        <td>
                            {ownerIfKnown(tt.data)}
                        </td>
                    </tr>
                );
            });
    };

    return (
        <div>
            <table className="mytable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Est.</th>
                        <th>State</th>
                        <th>Blocked</th>
                        <th>Owner</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTasks()}
                </tbody>
            </table>
        </div>
    );

}
