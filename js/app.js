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

    var data;

    $.getJSON("studies.json", function(studyData) {

        data = studyData;

        switch ($.mobile.path.get()) {

            case "scenarios":
                refreshScenarioList(data);
                break;
            case "schedule_home":
                refreshSchedule(data);
                break;
            case "home":
            default:
                refreshStudyList(data);
        }


        $(document).on('pagecontainerbeforetransition', function(event, ui) {
            switch (ui.toPage[0].id) {
                case "home":
                    refreshStudyList(data);
                    break;
                case "scenarios":
                    refreshScenarioList(data);
                    break;
                case "schedule_home":
                    refreshSchedule(data);
                    break;
            }
        });

    });





    // $('#home').on('pagecontainerbeforehide', refreshStudyList);

    // $('#scenarios').on('pageshow', refreshScenarioList);

    // $('#schedule_home').on('pageshow', refreshSchedule);


});

function refreshStudyList(data) {
    $('#studyList').empty();
    var studies = data;
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
        $(this).click(function(e) {
            sessionStorage.studyIndex = index;
        });

    })

    $('#studyList').listview('refresh');
}

function refreshScenarioList(data) {
    var study = data[sessionStorage.studyIndex];
    $('#scenarioListTitle').html(study.name);

    $('#scenarioList').empty();
    var scenarios = data[sessionStorage.studyIndex].scenarios;
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
        $('#scenarioList').append(_HTML(elmt));

    };
    $('#scenarioList li').each(function(index) {
        $(this).click(function(e) {
            sessionStorage.scenarioIndex = index;
        });
    });
    $('#scenarioList').listview("refresh");
}

function refreshSchedule(data) {
    $.getJSON('schedule.json', function(scheudleData) {

        var scenario = data[sessionStorage.studyIndex].scenarios[sessionStorage.scenarioIndex];
        $('#visitListTitle').html(scenario.name);

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

        for (var i = 0; i < scheudleData.length; i++) {
            visit = scheudleData[i];

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
                            href: '#schedule_detail'
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