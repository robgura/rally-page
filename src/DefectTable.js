/*global moment */

import {
    getBlockedHtml,
    itemSort2,
    ownerIfKnown,
} from './util.js';

export default function DefectTable(props) {

    const {
        records,
    } = props;

    const renderRecords = () => {
        return records
            .filter((rr) => {
                if (rr.isDefect()) {
                    if (rr.data.State === 'Completed' || rr.data.ScheduleState === 'Completed' || rr.data.ScheduleState === 'Accepted') {
                        if (rr.data.Blocked) {
                            return true;
                        }
                    }
                    else {
                        return true;
                    }
                }
                return false;
            })
            .sort(itemSort2)
            .map((rr) => {
                // console.log('rr', rr.getCustomFields());
                return (
                    <tr key={rr.data.FormattedID} >
                        <td>
                            {rr.data.Release.Name}
                        </td>
                        <td>
                            {moment(new Date()).diff(new Date(rr.data.CreationDate), 'days')}
                        </td>
                        <td>
                            <a href={rr.getUri()}> {rr.data.FormattedID} </a>
                        </td>
                        <td>
                            {rr.data.Name}
                        </td>
                        <td>
                            {rr.data.c_IsCustomer ? 'Cust' : ''}
                        </td>
                        <td>
                            {rr.data.Priority}
                        </td>
                        <td>
                            {rr.data.ScheduleState}
                        </td>
                        <td>
                            {getBlockedHtml(rr.data)}
                        </td>
                        <td>
                            {ownerIfKnown(rr.data)}
                        </td>
                    </tr>
                );
            });
    };

    return (
        <div>
            <table className="mytable">
                <tbody>
                    {renderRecords()}
                </tbody>
            </table>
        </div>
    );
}
