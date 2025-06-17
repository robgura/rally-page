/*global isProduction, React, ReactDOM, Ext */

// cSpell: ignore releasestatus afterrender hierarchicalrequirement rallyreleasecombobox wsapi xtype

import './styles.css';
import DefectTable from './DefectTable.js';
import UserStoryTable from './UserStoryTable.js';
import { who } from './util.js';

let getUpdate = null;
let extId = null;

function MainElement(props) {
    const {
        user,
    } = props;

    const [release, setRelease] = React.useState({
        releaseName: '',
        releaseValue: '',
    });

    const [records, setRecords] = React.useState([]);

    React.useEffect(() => {
        if (release.releaseValue !== '') {
            Ext.create('Rally.data.wsapi.artifact.Store', {
                models: ['UserStory', 'Defect'],
                fetch: [
                    'Blocked',
                    'BlockedReason',
                    'c_IsCustomer',
                    'c_Lifecycle',
                    'Connections',
                    'CreationDate',
                    'Discussion',
                    'DisplayName',
                    'FormattedID',
                    'Name',
                    'Owner',
                    'PlanEstimate',
                    'Priority',
                    'Release',
                    'ScheduleState',
                    'Severity',
                    'State',
                    'Tags',
                    'Tasks',
                    'UserName',
                ],
                autoLoad: true,
                filters: [
                    {
                        property: 'Release',
                        value: release.releaseValue,
                    },
                    {
                        property: 'ScheduleState',
                        operator: '<=',
                        value: 'Completed',
                    }
                ],
                listeners: {
                    load: function(store, _records) {
                        setRecords(_records);
                    }
                }
            });
        }

    }, [release, setRecords]);

    const onSave = (savedRecs) => {
        savedRecs.store.reload({
            load: function(store, _records) {
                setRecords(_records);
            }
        });
    };

    getUpdate = (releaseName, releaseValue) => {
        setRelease({
            releaseName,
            releaseValue,
        });
    };

    const isBlockedDefect = (rr) => {
        if (rr.data.ScheduleState === 'Completed') {
            if (rr.data.Blocked) {
                return rr.data.Priority === 'High' || rr.data.Priority === 'Critical';
            }
            return false;
        }
        return rr.data.Priority === 'High' || rr.data.Priority === 'Critical';
    };

    const defectRecords = React.useMemo(() => {
        return records.filter((rr) => {
            return rr.isDefect() && isBlockedDefect(rr);
        });
    }, [records]);

    const otherDefects = React.useMemo(() => {
        return records.filter((rr) => {
            if (rr.isDefect()) {
                if (rr.data.ScheduleState !== 'Completed' && rr.data.ScheduleState !== 'Accepted') {
                    return !isBlockedDefect(rr);
                }
            }
        });
    }, [records]);

    const storyRecords = React.useMemo(() => {
        return records.filter((rr) => {
            if (rr.isUserStory()) {
                if (rr.data.ScheduleState === 'Completed') {
                    return rr.data.Blocked;
                }
                return rr.data.ScheduleState !== 'Completed' && rr.data.ScheduleState !== 'Accepted';
            }
        });
    }, [records]);

    const userName = who(user);
    return (
        <div className={`main-container ${userName}`}>
            <h2> Blocking Defects </h2>
            <DefectTable records={defectRecords} user={user} onSave={onSave} />
            <h2> Stories </h2>
            <UserStoryTable records={storyRecords} user={user} onSave={onSave}/>
            <h2> Other Defects </h2>
            <DefectTable records={otherDefects} user={user} onSave={onSave} />
        </div>
    );
}

export function afterrender(app) {
    if (!isProduction) {
        // for some reason in development react only works if it is attached in the afterrender
        let root = document.getElementById(extId);
        root.style.overflow = 'visible';
        const user = app.getContext().getUser();
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(<MainElement app={app} user={user} />);
    }
}

export function onLoad(app) {
    const iterUpdate = (releaseName, releaseValue) => {
        if (getUpdate) {
            getUpdate(releaseName, releaseValue);
        }
    };

    app.add({
        xtype: 'rallyreleasecombobox',
        listeners: {
            ready: (i) => { iterUpdate(i.rawValue, i.value); },
            select: (i) => { iterUpdate(i.rawValue, i.value); },
        }
    });

    const extPanel = app.add({
        xtype: 'panel',
        height: 1000,
        layout: 'fit',
        autoScroll: true,
        items: [
            { html: '<div id="root"> </div>', }
        ]
    });

    extId = extPanel.getId();
    if (isProduction) {
        // for some reason in rally (i.e. production) react only works if is attached right away
        let root = document.getElementById(extId);
        root.style.overflow = 'visible';
        const user = app.getContext().getUser();
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(<MainElement app={app} user={user} />);
    }
}
