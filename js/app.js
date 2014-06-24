_scope = {
    studyIndex: -1,
    scenarioIndex: -1,
    data: null,
}


function _HTML(elmt) {

    if (typeof(elmt) === "string") {
        return elmt;
    } else {
        var el = document.createElement(elmt.tag);
        for (var attr in elmt.attrs) {
            el.setAttribute(attr, elmt.attrs[attr]);
        }

        if (elmt.inner) {
            var html = "";
            for (var i = 0; i < elmt.inner.length; i++) {
                html += _HTML(elmt.inner[i]);
            }
            el.innerHTML = html;
        } else {
            el.innerHTML = "";
        }
        return el.outerHTML;
    }
}

$(function() {

    $.getJSON("studies.json", function(data) {

        _scope.data = data;
        refreshStudyList();

    });

    $('#home').on('pageshow', refreshStudyList);

    $('#scenarios').on('pageshow', refreshScenarioList);

    $('#schedule_home').on('pageshow', refreshSchedule);
});

function refreshStudyList() {
    $('#studyList').empty();
    var studies = _scope.data;
    var study, elmt;
    for (var i = 0; i < studies.length; i++) {
        study = studies[i];
        elmt = {
            tag: 'li',
            inner: [{
                tag: 'a',
                attrs: {
                    href: "#scenarios"
                },
                inner: [study.name]
            }]
        }
        $('#studyList').append(_HTML(elmt));        
    }
    $('#studyList li').each(function(index) {    	
    	$( this ).click(index, function(e) {
            _scope.studyIndex = index;            
        });

    })
    
    $('#home').trigger('create');
}

function refreshScenarioList() {
    $('#scenarioList').empty();    
    var scenarios = _scope.data[_scope.studyIndex].scenarios;    
    var scenario, elmt;
    for (var j = 0; j < scenarios.length; j++) {
        scenario = scenarios[j];
        elmt = {
            tag: 'li',
            inner: [{
                tag: 'a',
                attrs: {
                    href: "#schedule_home"
                },
                inner: [scenario.name]
            }]
        };
        $('#scenarioList').append(_HTML(elmt)).click({scenarioIndex: j}, function(e) {
            _scope.scenarioIndex = e.data.scenarioIndex;
        });
    };
}

function refreshSchedule() {
    $.getJSON('schedule.json', function(data) {
        $('#visitList').empty();
        var activityListHeader = {
            tag: 'li',
            attrs: {
                "data-role": "list-divider"
            },
            inner: ["Schedule Activities", {
                tag: 'span',
                attrs: {
                    style: 'float: right; vertical-algin:middle'
                },
                inner: "Quantity"
            }]
        };

        var visit, visitCollapsible, activity, activityList;

        for (var i = 0; i < data.length; i++) {
            visit = data[i];

            activityList = {
                tag: 'ul',
                attrs: {
                    "data-role": "listview",
                    "data-theme": "a",
                    "data-divider-theme": "a"
                },
                inner: [activityListHeader]
            };


            for (var j = 0; j < visit.activities.length; j++) {
                activity = visit.activities[j];
                activityList.inner.push({
                    tag: 'li',
                    inner: [{
                        tag: 'a',
                        attrs: {
                            href: '#'
                        },
                        inner: [activity.name, {
                            tag: 'span',
                            attrs: {
                                "class": "ui-li-count"
                            },
                            inner: [activity.quantity.toString()]
                        }]
                    }]
                })
            }

            visitCollapsible = {
                tag: 'div',
                attrs: {
                    "data-role": "collapsible"
                },
                inner: [{
                        tag: "h1",
                        inner: visit.name
                    },
                    activityList
                ]
            };

            $('#visitList').append(_HTML(visitCollapsible));
        }

        $('#schedule_home').trigger('create');
    });
};