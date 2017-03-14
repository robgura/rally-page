/*global rally, document */

String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var iterDropdown;
var rallyDataSource;

function OpenStoriesTasksAndDefects() { // eslint-disable-line no-unused-vars
    var that = this;

    var busySpinner;
    var defectTable, storyTable;
    var abbrev = { 'User Story': 'ar', 'Defect': 'df', 'Task': 'tk', 'TestCase': 'tc' };

    function indentedItem(content/*, color*/) {
        var indentationDiv = '<div style="margin-left: 20px;">' + content + '</div>';
        return indentationDiv;
    }

    function ownerIfKnown(arti) {
        var owner = '',
            hasDisplay = false;

        if (arti.Owner) {
            if (arti.Owner.DisplayName) {
                owner = arti.Owner.DisplayName;
                hasDisplay = true;
            }
            else if (arti.Owner.UserName) {
                owner = arti.Owner.UserName;
            }
        }

        if (! hasDisplay) {
            var firstLastNameEmail = owner.match(/([^\.]+)\.([^\.]+)@.*/);

            if (firstLastNameEmail) {
                owner = firstLastNameEmail[2].capFirst() + ', ' + firstLastNameEmail[1].capFirst();
            }

            var firstInitialEmail = owner.match(/(.)(.+)@/);

            if (firstInitialEmail) {
                owner = firstInitialEmail[1].capFirst() + '. ' + firstInitialEmail[2].capFirst();
            }
        }

        return owner;
    }

    function artifactLink(artifactName, artifact) {
        var artUrl = '__SERVER_URL__/detail/_ABBREV_/_OID_';
        artUrl = artUrl.replace('_ABBREV_', abbrev[artifactName]);
        artUrl = artUrl.replace('_OID_', artifact.ObjectID);
        var linkText = artifact.FormattedID + ' ' + artifact.Name;
        var link = '<a href="_URL_" target="_blank">_TEXT_</a>';
        link = link.replace('_URL_', artUrl);
        link = link.replace('_TEXT_', linkText);
        return link;
    }
    function getPriority(item) {
        var rv = '';
        if (item.Priority !== 'None') {
            rv = item.Priority;
        }
        return rv;
    }
    function getRelease(item) {
        var rv = '';
        if (item.Release) {
            rv = item.Release.Name;
        }
        return rv;
    }
    function getBlockedHtml(item) {
        var rv = '';
        if (item.Blocked) {
            if (item.BlockedReason && item.BlockedReason.match(/pr/i)) {
                rv = item.BlockedReason;
            }
            else {
                rv = item.BlockedReason;
                if (! rv) {
                    rv = 'Blocked';
                }
            }
            rv = '<b style="color:red">' + rv + '</b>';
        }
        return rv;
    }
    function displayChild(item, tableData, tableInfo, parentInfo) {
        if (item.State === 'Completed' || item.ScheduleState === 'Completed' || item.ScheduleState === 'Accepted') {
            if (item.Blocked) {
                if (parentInfo && ! parentInfo.displayed) {
                    tableData.push(parentInfo);
                    parentInfo.displayed = true;
                }
                tableData.push(tableInfo);
            }
        }
        else {
            if (parentInfo && ! parentInfo.displayed) {
                tableData.push(parentInfo);
                parentInfo.displayed = true;
            }
            tableData.push(tableInfo);
        }
    }

    function itemSort(left, rite) {
        var computedValue = function(item) {
            var rv = 0;

            if (item.State === 'Completed' || item.ScheduleState === 'Completed') {
                rv += 1000;
            }
            else if (item.State === 'In-Progress' || item.ScheduleState === 'In-Progress') {
                rv += 2000;
            }
            else {
                rv += 3000;
            }

            if (! item.Blocked) {
                rv += 100;
            }

            if (item.Priority === 'Immediate') { rv += 10; }
            else if (item.Priority === 'High') { rv += 20; }
            else if (item.Priority === 'Normal') { rv += 30; }
            else if (item.Priority === 'Low') { rv += 40; }
            else { rv += 50; }

            return rv;
        };

        var rv = computedValue(left) - computedValue(rite);

        if (rv === 0) {
                var leftOwner = ownerIfKnown(left),
                    riteOwner = ownerIfKnown(rite);
                rv = leftOwner.localeCompare(riteOwner);

            if (rv === 0) {
                if (left.TaskIndex && rite.TaskIndex) {
                    rv = left.TaskIndex - rite.TaskIndex;
                }
                // Order defects by formatted ID and thus by age.
                // 
                else if (left._type !== 'Defect' && left.Rank && rite.Rank) {
                    rv = left.Rank - rite.Rank;
                }

                if (rv === 0) {
                    rv = left.FormattedID.localeCompare(rite.FormattedID);
                }
            }
        }
        return rv;
    }

    function showStories(stories, contentDiv) {
        var storyLink, storyInfo;
        var taskLink, taskInfo, indentedTask;
        var defectLink, defectInfo, indentedDefect;
        var tableData = [];
        var tblConfig, emptyStory;

        stories.filter(function(story) {
            // only show stories that are blocked and are NOT Completed and Not Accepted
            return story.Blocked || ! (story.ScheduleState === 'Completed' || story.ScheduleState === 'Accepted');
        }).sort(itemSort).forEach(function(story) {
            var storyOwner = ownerIfKnown(story);

            emptyStory = true;
            storyLink = artifactLink('User Story', story);
            storyInfo = {
                'itemLink': '<div class="story-name">' + storyLink + '</div>',
                'status': '',
                'blocked': '',
                'userName': '<div class="story-owner">' + storyOwner + '</div>'
            };

            story.Tasks.sort(itemSort).forEach(function(task) {
                emptyStory = false;
                taskLink = artifactLink('Task', task);
                indentedTask = indentedItem(taskLink);
                taskInfo = {
                    'itemLink': indentedTask,
                    'status': task.State,
                    'blocked': getBlockedHtml(task),
                    'userName': ownerIfKnown(task)
                };

                displayChild(task, tableData, taskInfo, storyInfo);
            });

            if (story.Defects) {
                story.Defects.sort(itemSort).forEach(function(defect) {
                    emptyStory = false;
                    defectLink = artifactLink('Defect', defect);
                    indentedDefect = indentedItem(defectLink);
                    defectInfo = {
                        'itemLink': indentedDefect,
                        'status': defect.ScheduleState,
                        'blocked': getBlockedHtml(defect),
                        'userName': ownerIfKnown(defect)
                    };

                    displayChild(defect, tableData, defectInfo, storyInfo);
                });
            }

            if (emptyStory) {
                tableData.push(storyInfo);
            }

        });
        tblConfig = {
            'columnKeys': ['itemLink', 'status', 'blocked', 'userName'],
            'columnHeaders': ['Artifact', 'Status', 'Blocked', 'Owner'   ],
            'columnWidths': ['800px', '100px', '200px', '200px'   ],
            'sortingEnabled': false
        };

        storyTable = new rally.sdk.ui.Table(tblConfig);
        storyTable.addRows(tableData);
        storyTable.display(contentDiv);
    }

    function showDefects(defects, contentDiv) {
        var tableData = [];
        var tblConfig;
        var defectLink, defectInfo;

        var in_progress = [ 0, 0, 0 ],
            defined = [ 0, 0, 0 ],
            comp_pr = 0;

        defects.sort(itemSort).forEach(function(defect) {
            defectLink = artifactLink('Defect', defect);
            defectInfo = { 'defectLink': defectLink,
                'status': defect.ScheduleState,
                'priority': getPriority(defect),
                'release': getRelease(defect),
                'blocked': getBlockedHtml(defect),
                'userName': ownerIfKnown(defect)
            };

            if (defect.ScheduleState === 'Completed' && defect.BlockedReason === 'PR') {
                comp_pr += 1;
            }

            if (defect.ScheduleState === 'In-Progress') {
                if (defect.Priority === 'Low') {
                    in_progress[0] += 1;
                }
                else if (defect.Priority === 'High') {
                    in_progress[2] += 1;
                }
                else {
                    in_progress[1] += 1;
                }
            }

            if (defect.ScheduleState === 'Defined') {
                if (defect.Priority === 'Low') {
                    defined[0] += 1;
                }
                else if (defect.Priority === 'High') {
                    defined[2] += 1;
                }
                else {
                    defined[1] += 1;
                }
            }

            displayChild(defect, tableData, defectInfo);
        });
        tblConfig = {
            'columnKeys': ['release', 'defectLink', 'priority', 'status', 'blocked', 'userName'],
            'columnHeaders': ['Release', 'Defect', 'Priority', 'Status', 'Blocked', 'Owner'   ],
            'columnWidths': ['75px', '800px', '75', '100px', '200px', '200px'   ]
        };

        defectTable = new rally.sdk.ui.Table(tblConfig);
        defectTable.addRows(tableData);
        defectTable.display(contentDiv);

        document.getElementById('def-comp-pr').innerHTML = comp_pr;

        document.getElementById('def-ip-high').innerHTML = in_progress[2];
        document.getElementById('def-ip-low').innerHTML = in_progress[0];
        document.getElementById('def-ip-other').innerHTML = in_progress[1];

        document.getElementById('def-defined-high').innerHTML = defined[2];
        document.getElementById('def-defined-low').innerHTML = defined[0];
        document.getElementById('def-defined-other').innerHTML = defined[1];
    }

    function showResults(results) {
        document.getElementById('stories_count').innerHTML = '';
        document.getElementById('defects_count').innerHTML = '';
        if (busySpinner) {
            busySpinner.hide();
            busySpinner = null;
        }

        document.getElementById('stories_count').innerHTML = 'Stories: ' + results.stories.length;

        // defects with tasks will be listed with the user stories
        var ownedStories = results.stories.concat(results.defects.filter(function(defect) {
            return defect.Tasks.length > 0;
        }));

        if (ownedStories.length > 0) {
            showStories(ownedStories, 'stories');
        }

        // defects with no tasks will be listed separately from defects with tasks
        var ownedDefects = results.defects.filter(function(defect) {
            return defect.Tasks.length === 0;
        });
        if (ownedDefects.length > 0) {
            showDefects(ownedDefects, 'defects');
        }
    }

    that.onIterationSelected = function() {
        var targetIterationName = iterDropdown.getSelectedName();
        var iterCond = '(Iteration.Name = "_ITER_TARGET_")'.replace('_ITER_TARGET_', targetIterationName);
        var scheduleStateCondition = '(ScheduleState != "Accepted")';
        var storyCriteria = '(' + iterCond + ' AND ' + scheduleStateCondition + ')';
        var defectCriteria = '(' + iterCond + ' AND ' + scheduleStateCondition + ')';
        var queryConfigs = [];
        var hrColumns = [
            'Blocked',
            'BlockedReason',
            'Defects',
            'DisplayName',
            'FormattedID',
            'Name',
            'ObjectID',
            'Owner',
            'Priority',
            'Rank',
            'Release',
            'ScheduleState',
            'State',
            'TaskIndex',
            'Tasks',
            'UserName'
        ];

        queryConfigs[0] = {
            type: 'hierarchicalrequirement',
            key: 'stories',
            fetch: hrColumns.join(','),
            query: storyCriteria
        };
        queryConfigs[1] = {
            type: 'defect',
            key: 'defects',
            fetch: hrColumns.join(','),
            query: defectCriteria
        };
        busySpinner = new rally.sdk.ui.basic.Wait({});
        busySpinner.display('wait');

        if (storyTable) {
            storyTable.destroy();
            storyTable = null;
        }
        if (defectTable) {
            defectTable.destroy();
            defectTable = null;
        }

        rallyDataSource.setApiVersion('1.43');
        rallyDataSource.findAll(queryConfigs, showResults);
    };
}
