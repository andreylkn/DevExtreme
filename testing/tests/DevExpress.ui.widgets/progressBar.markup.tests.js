"use strict";

var $ = require("jquery");

require("ui/progress_bar");
require("common.css!");

QUnit.testStart(function() {
    var markup =
        '<div id="progressbar"></div>';

    $("#qunit-fixture").html(markup);
});

function toSelector(text) {
    return "." + text;
}

var PROGRESSBAR_CLASS = "dx-progressbar",
    PROGRESSBAR_CONTAINER_CLASS = "dx-progressbar-container",
    PROGRESSBAR_RANGE_CLASS = "dx-progressbar-range",
    PROGRESSBAR_WRAPPER_CLASS = "dx-progressbar-wrapper",
    PROGRESSBAR_STATUS_CLASS = "dx-progressbar-status",
    PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = "dx-progressbar-animating-container",
    PROGRESSBAR_INDETERMINATE_SEGMENT = "dx-progressbar-animating-segment";

QUnit.module("ProgressBar markup", {
    beforeEach: function() {
        this.$element = $("#progressbar");
    }
});

QUnit.test("rendered markup", function(assert) {
    assert.expect(5);

    var $progressBar = this.$element.dxProgressBar();

    assert.ok($progressBar.hasClass(PROGRESSBAR_CLASS), "ProgressBar initialized");
    assert.equal($progressBar.find(toSelector(PROGRESSBAR_CONTAINER_CLASS)).length, 1, "Container has been created");
    assert.equal($progressBar.find(toSelector(PROGRESSBAR_RANGE_CLASS)).length, 1, "Range has been created");
    assert.equal($progressBar.find(toSelector(PROGRESSBAR_WRAPPER_CLASS)).length, 1, "Wrapper div has been created");
    assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 1, "Status div has been created");
});

QUnit.test("showStatus test", function(assert) {
    assert.expect(2);

    var $progressBar = this.$element.dxProgressBar({
            showStatus: false
        }),
        progressBar = $progressBar.dxProgressBar("instance");

    assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 0, "Status div hasn't been created");

    progressBar.option("showStatus", true);
    assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 1, "Status div has been added");
});

QUnit.test("value display in status", function(assert) {
    var $progressBar = this.$element.dxProgressBar({
            value: 10
        }),
        progressBar = $progressBar.dxProgressBar("instance"),
        $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));

    assert.equal($status.text(), "Progress: " + progressBar.option("value") + "%", "status text is right");
});

QUnit.test("custom status format", function(assert) {
    var $progressBar = this.$element.dxProgressBar({
            value: 10,
            statusFormat: function(value) {
                return "Customised value: " + value * 100;
            }
        }),
        progressBar = $progressBar.dxProgressBar("instance"),
        $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));
    assert.equal($status.text(), "Customised value: " + progressBar.option("value"), "status text is right");
});

QUnit.test("appropriate class should be added depending on the 'statusPosition' option", function(assert) {
    var possiblePositions = [
        "left", "right", "bottom left", "bottom right", "bottom center", "top left", "top right", "top center"
    ];

    var $progressBar = this.$element.dxProgressBar({}),
        progressBar = $progressBar.dxProgressBar("instance"),
        $wrapper = $progressBar.find("." + PROGRESSBAR_WRAPPER_CLASS);

    $.each(possiblePositions, function(_, position) {
        progressBar.option("statusPosition", position);

        var splitPosition = position.split(" "),
            className = "dx-position-" + splitPosition[0];

        if(splitPosition[1]) {
            className += "-" + splitPosition[1];
        }

        assert.ok($wrapper.hasClass(className), "wrapper correct class for the '" + position + "' position");
    });
});

QUnit.test("render indeterminate state on init", function(assert) {
    assert.expect(2);

    var $progressBar = this.$element.dxProgressBar({
            value: null
        }),
        progressBar = $progressBar.dxProgressBar("instance");

    var renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length,
        defaultSegmentCount = progressBar.option("_animatingSegmentCount");

    assert.equal($progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER)).length, 1, "Segment wrapper has been created");
    assert.equal(renderedIndeterminateSegmentsCount, defaultSegmentCount, "Segments have been created");
});

QUnit.test("render indeterminate state with default option segments count", function(assert) {
    var $progressBar = this.$element.dxProgressBar({
            value: undefined,
            showStatus: false
        }),
        progressBar = $progressBar.dxProgressBar("instance");

    var renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length,
        defaultSegmentCount = progressBar.option("_animatingSegmentCount");

    assert.equal(renderedIndeterminateSegmentsCount, defaultSegmentCount, "dxProgressBar have been created with correct segment count");
});
QUnit.module("aria accessibility");

QUnit.test("aria role", function(assert) {
    var $element = $("#progressbar").dxProgressBar({});
    assert.equal($element.attr("role"), "progressbar", "aria role is correct");
});

QUnit.test("aria properties", function(assert) {
    var $element = $("#progressbar").dxProgressBar({
        min: 32,
        max: 137,
        value: 58
    });

    assert.equal($element.attr("aria-valuemin"), 32, "min value is correct");
    assert.equal($element.attr("aria-valuemax"), 137, "max value is correct");
    assert.equal($element.attr("aria-valuenow"), 58, "current value is correct");

});
