/*global React */

import {
    getBlockedHtml,
    getLink,
    Owner,
    taskSort,
} from './util.js';

export default function TaskTable(props) {

    const {
        model,
        user,
    } = props;

    const [tasks, setTasks] = React.useState({
        state: 'init',
        records: [],
    });

    const NumberForm = new Intl.NumberFormat(undefined, {
        style: 'decimal',
        minimumIntegerDigits: 1,
        minimumFractionDigits: 1,
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
                        <td className="task-estimate">
                            {NumberForm.format(tt.data.Estimate)}
                        </td>
                        <td>
                            {tt.data.State}
                        </td>
                        <td>
                            {getBlockedHtml(tt.data)}
                        </td>
                        <td>
                            <Owner artifact={tt.data} user={user} />
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
