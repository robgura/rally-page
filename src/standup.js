/*global isProduction, React, ReactDOM, Ext */

// cSpell: ignore iterationstatus afterrender hierarchicalrequirement rallyiterationcombobox wsapi xtype

import './styles.css';
import DefectSummary from './DefectSummary.js';
import DefectTable from './DefectTable.js';
import UserStoryTable from './UserStoryTable.js';
import { who } from './util.js';

let getUpdate = null;
let extId = null;

function MainElement(props) {
    const {
        user,
    } = props;

    const [iteration, setIteration] = React.useState({
        iterationName: '',
        iterationValue: '',
    });

    const [records, setRecords] = React.useState([]);

    React.useEffect(() => {
        if (iteration.iterationValue !== '') {
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
                        property: 'Iteration',
                        value: iteration.iterationValue,
                    },
                    {
                        property: 'ScheduleState',
                        operator: '!=',
                        value: 'Accepted',
                    }
                ],
                listeners: {
                    load: function(store, _records) {
                        setRecords(_records);
                    }
                }
            });
        }

    }, [iteration, setRecords]);

    const onSave = (savedRecs) => {
        savedRecs.store.reload({
            load: function(store, _records) {
                setRecords(_records);
            }
        });
    };

    getUpdate = (iterationName, iterationValue) => {
        setIteration({
            iterationName,
            iterationValue,
        });
    };

    const defectRecords = React.useMemo(() => {
        return records.filter((rr) => {
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
        });
    }, [records]);

    const storyRecords = React.useMemo(() => {
        return records.filter((rr) => {
            if (rr.data.ScheduleState === 'Defined' || rr.data.ScheduleState === 'In-Progress') {
                // anything that can and does have tasks will be displayed
                if (rr.canHaveTasks() && rr.data.Tasks.Count > 0) {
                    return true;
                }
                // all users stories will be displayed regardless of if they have tasks
                if (rr.isUserStory()) {
                    return true;
                }
            }
            else if (rr.data.Blocked && rr.isUserStory()) {
                return true;
            }

            if (rr.isUserStory() && rr.data.c_Lifecycle !== 'Demo') {
                return true;
            }

            return false;
        });
    }, [records]);

    const userName = who(user);
    return (
        <div className={`main-container ${userName}`}>
            <DefectSummary records={records} />
            <DefectTable records={defectRecords} user={user} onSave={onSave} />
            <UserStoryTable records={storyRecords} user={user} onSave={onSave}/>
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
    const iterUpdate = (iterationName, iterationValue) => {
        if (getUpdate) {
            getUpdate(iterationName, iterationValue);
        }
    };

    app.add({
        xtype: 'rallyiterationcombobox',
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
