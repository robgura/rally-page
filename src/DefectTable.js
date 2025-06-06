/*global moment */

import {
    getBlockedHtml,
    getLink,
    itemSort2,
    Owner,
} from './util.js';

import ArtifactName from './ArtifactName.js';

export default function DefectTable(props) {

    const {
        records,
        user,
    } = props;

    const renderRecords = () => {
        return records
            .filter((rr) => {
                // don't include any records that have tasks, those will end up being shown in the story tables
                if (rr.canHaveTasks() && rr.data.Tasks.Count > 0) {
                    return false;
                }

                if (rr.isDefect()) {
                    if (rr.data.ScheduleState === 'Completed' || rr.data.ScheduleState === 'Accepted') {
                        if (rr.data.Blocked) {
                            return true;
                        }
                        if (rr.data.State !== 'Fixed' && rr.data.State !== 'Closed') {
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
                const link = getLink(rr);
                let className = '';
                if (rr.data.Blocked) {
                    className = 'blocked';
                }
                let thing = null;
                if (rr.data.c_IsCustomer) {
                    thing = <span style={{ fontSize: '18px' }} > {String.fromCodePoint(128556)} </span>;
                }
                else if (rr.data.Severity === 'Internal') {
                    thing = <span style={{ fontSize: '18px' }} > {String.fromCodePoint(129729)} </span>;
                }

                if (rr.canHaveTasks() && rr.data.Tasks.Count > 0) {
                    className += ' defect-with-tasks';
                }

                const renderAge = () => {
                    const age = moment(new Date()).diff(new Date(rr.data.CreationDate), 'days');

                    if (age > 90) {
                        return (
                            <td>
                                <div className="parchment">
                                    <div className="background">
                                        {age}
                                    </div>
                                    <div className="text">
                                        {age}
                                    </div>
                                </div>
                            </td>
                        );
                    }
                    return (
                        <td>
                            <div className="age">{age}</div>
                        </td>
                    );
                };

                return (
                    <tr className={className} key={rr.data.FormattedID} >
                        <td>
                            {rr.data.Release.Name}
                        </td>
                        {renderAge()}
                        <td>
                            <a href={link}> {rr.data.FormattedID} </a>
                        </td>
                        <td>
                            <ArtifactName record={rr} />
                        </td>
                        <td>
                            <div className="thing">
                                {thing}
                            </div>
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
                            <Owner artifact={rr.data} user={user} />
                        </td>
                    </tr>
                );
            });
    };

    return (
        <div className="defect-display">
            <table className="mytable">
                <thead>
                    <tr>
                        <th>Release</th>
                        <th>Age</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Visible</th>
                        <th>Priority</th>
                        <th>State</th>
                        <th>Blocked</th>
                        <th>Owner</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRecords()}
                </tbody>
            </table>
        </div>
    );
}
