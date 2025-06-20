/*global moment */

import {
    getBlockedHtml,
    getLink,
    itemSort2,
    isSupport,
} from './util.js';
import Owner from './Owner.js';
import Action from './Action.js';

import ArtifactName from './ArtifactName.js';

export default function DefectTable(props) {

    const {
        onSave,
        records,
        user,
    } = props;

    const renderRecords = () => {
        return records
            .sort(itemSort2)
            .map((rr) => {
                const link = getLink(rr);
                let className = '';
                if (rr.data.Blocked) {
                    className = 'blocked';
                }
                let thing = null;

                const support = isSupport(rr);

                if (support) {
                    thing = <span style={{ fontSize: '18px' }} > {String.fromCodePoint(128222)} </span>;
                }
                else if (rr.data.c_IsCustomer) {
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
                            {rr.data.Release?.Name}
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
                        <td>
                            <Action artifact={rr} user={user} onSave={onSave} />
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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {renderRecords()}
                </tbody>
            </table>
        </div>
    );
}
