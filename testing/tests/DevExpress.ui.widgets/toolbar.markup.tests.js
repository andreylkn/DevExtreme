"use strict";

import "ui/action_sheet";
import "ui/button";
import "ui/tabs";
import "ui/drop_down_menu";
import $ from "jquery";
import Toolbar from "ui/toolbar";

import "common.css!";

QUnit.testStart(() => {
    let markup = "<div id='toolbar'></div>";

    $("#qunit-fixture").html(markup);
});

const { test } = QUnit;

const TOOLBAR_CLASS = "dx-toolbar",
    TOOLBAR_ITEM_CLASS = "dx-toolbar-item",
    TOOLBAR_BEFORE_CONTAINER_CLASS = "dx-toolbar-before",
    TOOLBAR_AFTER_CONTAINER_CLASS = "dx-toolbar-after",
    TOOLBAR_CENTER_CONTAINER_CLASS = "dx-toolbar-center",
    TOOLBAR_LABEL_CLASS = "dx-toolbar-label",
    TOOLBAR_MENU_BUTTON_CONTAINER_CLASS = "dx-toolbar-menu-container",
    TOOLBAR_GROUP_CLASS = "dx-toolbar-group",

    DROP_DOWN_MENU_CLASS = "dx-dropdownmenu";

const prepareItemTest = function(itemData) {
    let toolbar = new Toolbar($("<div>"), {
        items: [itemData]
    });

    return toolbar.itemElements().eq(0).find(".dx-item-content").contents();
};

QUnit.module("render", {
    beforeEach: () => {
        this.element = $("#toolbar");
    }
}, () => {
    test("containers", (assert) => {
        this.element.dxToolbar({});

        let beforeContainer = this.element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS);
        assert.equal(beforeContainer.length, 1);

        let afterContainer = this.element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS);
        assert.equal(afterContainer.length, 1);

        let centerContainer = this.element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS);
        assert.equal(centerContainer.length, 1);
    });

    test("render dropDownMenu", (assert) => {
        this.element.dxToolbar({
            items: [
                { location: "after", locateInMenu: "always", widget: "button", options: { text: "After Button" } }
            ]
        });

        let $toolbarMenuContainer = this.element.find("." + TOOLBAR_MENU_BUTTON_CONTAINER_CLASS);

        assert.equal($toolbarMenuContainer.length, 1, "Menu container rendered");
        assert.ok($toolbarMenuContainer.children().hasClass(DROP_DOWN_MENU_CLASS), "DropDownMenu rendered");
    });

    test("items - widgets", (assert) => {
        this.element.dxToolbar({
            items: [
                { location: "before", widget: "button", options: { text: "Before Button" } },
                { location: "after", widget: "button", options: { text: "After Button" } },
                {
                    location: "center", widget: "tabs", options: {
                        items: [{ text: "Tab 1" }, { text: "Tab 2" }, { text: "Tab 3" }]
                    }
                }
            ]
        });

        let items = this.element.find("." + TOOLBAR_ITEM_CLASS);
        assert.equal(items.length, 3);

        assert.equal(items.eq(0).text(), "Before Button");
        assert.equal(items.eq(1).text(), "Tab 1Tab 2Tab 3");
        assert.equal(items.eq(2).text(), "After Button");

    });

    test("items - label", (assert) => {
        this.element.dxToolbar({
            items: [
                { location: "center", text: "Label" }
            ]
        });

        let label = this.element.find("." + TOOLBAR_ITEM_CLASS);

        assert.equal(label.length, 1);
        assert.equal(label.text(), "Label");
        assert.ok(label.hasClass(TOOLBAR_LABEL_CLASS));
    });

    test("items - custom html", (assert) => {
        this.element.dxToolbar({
            items: [
                { location: "center", html: "<b>Label</b>" }
            ]
        });

        let label = this.element.find("b");
        assert.equal(label.length, 1);
        assert.equal(label.text(), "Label");
        assert.ok(this.element.find("." + TOOLBAR_ITEM_CLASS).hasClass(TOOLBAR_LABEL_CLASS));
    });

    test("items - location", (assert) => {
        let element = this.element.dxToolbar({
            items: [
                { location: "before", text: "before" },
                { location: "after", text: "after" },
                { location: "center", text: "center" }
            ]
        });

        $.each(["before", "after", "center"], function() {
            assert.equal(element.find("." + TOOLBAR_CLASS + "-" + this).text(), this);
        });
    });

    test("items - location", (assert) => {
        let element = this.element.dxToolbar({
            items: [
                { location: "before", text: "before" },
                { location: "after", text: "after" },
                { location: "center", text: "center" }
            ]
        });

        $.each(["before", "after", "center"], function() {
            assert.equal(element.find("." + TOOLBAR_CLASS + "-" + this).text(), this);
        });
    });
});


QUnit.module("option change handlers", {
    beforeEach: () => {
        this.element = $("#toolbar");
    }
}, () => {
    test("items", (assert) => {
        let instance = this.element.dxToolbar({ items: [{ location: "center", text: "0" }] }).dxToolbar("instance");

        instance.option("items", [{ location: "center", text: "1" }]);
        assert.equal(this.element.text(), "1");
    });
});


QUnit.module("regressions", {
    beforeEach: () => {
        this.element = $("#toolbar").dxToolbar({});
        this.instance = this.element.dxToolbar("instance");
    }
}, () => {
    test("B231277", (assert) => {
        this.instance.option("items", [{ location: "center" }]);
        assert.equal($.trim(this.element.text()), "");

        this.instance.option("items", [{ location: "center", text: undefined }]);
        assert.equal($.trim(this.element.text()), "");

        this.instance.option("items", [{ location: "center", text: null }]);
        assert.equal($.trim(this.element.text()), "");
    });
});


QUnit.module("aria accessibility", () => {
    test("aria role", (assert) => {
        let $element = $("#toolbar").dxToolbar();

        assert.equal($element.attr("role"), "toolbar", "role is correct");
    });
});


QUnit.module("item groups", {
    beforeEach: () => {
        this.$element = $("#toolbar");
        this.groups = [
            {
                location: "before",
                items: [
                    { location: "before", text: "Item A-1" },
                    { location: "after", text: "Item A-2" }
                ]
            },
            {
                items: [
                    { text: "Item B-1", visible: false },
                    { text: "Item B-2" },
                    { text: "Item B-3" }
                ]
            },
            {
                location: "after",
                items: [
                    { text: "Item C-1" },
                    { text: "Item C-2" }
                ]
            }
        ];
    }
}, () => {
    test("toolbar should show item groups", (assert) => {
        let $element = this.$element.dxToolbar({
                items: this.groups
            }),
            $groups = $element.find("." + TOOLBAR_GROUP_CLASS);

        assert.equal($groups.length, 3, "3 groups rendered");
        assert.equal($groups.eq(0).find("." + TOOLBAR_ITEM_CLASS).length, 2, "first group contains 2 items");
        assert.equal($groups.eq(1).find("." + TOOLBAR_ITEM_CLASS).length, 3, "second group contains 3 items");
    });

    test("toolbar groups should be placed inside toolbar blocks", (assert) => {
        let $element = this.$element.dxToolbar({
                items: this.groups
            }),
            $before = $element.find("." + TOOLBAR_BEFORE_CONTAINER_CLASS).eq(0),
            $center = $element.find("." + TOOLBAR_CENTER_CONTAINER_CLASS).eq(0),
            $after = $element.find("." + TOOLBAR_AFTER_CONTAINER_CLASS).eq(0);

        assert.equal($before.find("." + TOOLBAR_ITEM_CLASS).length, 2, "2 items are in before");
        assert.equal($center.find("." + TOOLBAR_ITEM_CLASS).length, 3, "3 items are in center");
        assert.equal($after.find("." + TOOLBAR_ITEM_CLASS).length, 2, "2 items are in after");
    });
});


QUnit.module("default template", () => {
    test("template should be rendered correctly with text", (assert) => {
        let $content = prepareItemTest("custom");

        assert.equal($content.text(), "custom");
    });

    test("template should be rendered correctly with boolean", (assert) => {
        let $content = prepareItemTest(true);

        assert.equal($.trim($content.text()), "true");
    });

    test("template should be rendered correctly with number", (assert) => {
        let $content = prepareItemTest(1);

        assert.equal($.trim($content.text()), "1");
    });

    test("template should be rendered correctly with text", (assert) => {
        let $content = prepareItemTest({ text: "custom" });

        assert.equal($.trim($content.text()), "custom");
    });

    test("template should be rendered correctly with html", (assert) => {
        let $content = prepareItemTest({ html: "<span>test</span>" });

        let $span = $content.is("span") ? $content : $content.children();
        assert.ok($span.length);
        assert.equal($span.text(), "test");
    });

    test("template should be rendered correctly with htmlstring", (assert) => {
        let $content = prepareItemTest("<span>test</span>");

        assert.equal($content.text(), "<span>test</span>");
    });

    test("template should be rendered correctly with html & text", (assert) => {
        let $content = prepareItemTest({ text: "text", html: "<span>test</span>" });

        let $span = $content.is("span") ? $content : $content.children();

        assert.ok($span.length);
        assert.equal($content.text(), "test");
    });

    test("template should be rendered correctly with button without options", (assert) => {
        let $content = prepareItemTest({ widget: "button" });

        let button = $content.filter(".dx-button");
        assert.equal(button.length, 1);
    });

    test("template should be rendered correctly with dxbutton without options", (assert) => {
        let $content = prepareItemTest({ widget: "dxButton" });

        let button = $content.filter(".dx-button");
        assert.equal(button.length, 1);
    });

    test("template should be rendered correctly with button", (assert) => {
        let $content = prepareItemTest({ widget: "button", options: { text: "test" } });

        let button = $content.filter(".dx-button");
        assert.equal(button.length, 1);
        assert.equal($.trim(button.text()), "test");
    });

    test("template should be rendered correctly with dxtabs", (assert) => {
        let $content = prepareItemTest({ widget: "dxTabs", options: { items: [{ text: "test" }] } });

        let tabs = $content.filter(".dx-tabs");

        assert.equal(tabs.length, 1);
        assert.equal(tabs.find(".dx-tab").length, 1);
        assert.equal($.trim(tabs.text()), "test");
    });

    test("template should be rendered correctly with tabs", (assert) => {
        let $content = prepareItemTest({ widget: "tabs", options: { items: [{ text: "test" }] } });

        let tabs = $content.filter(".dx-tabs");

        assert.equal(tabs.length, 1);
        assert.equal(tabs.find(".dx-tab").length, 1);
        assert.equal($.trim(tabs.text()), "test");
    });

    test("template should be rendered correctly with dropDownMenu", (assert) => {
        let $content = prepareItemTest({ widget: "dropDownMenu", options: { items: [{ text: "test" }] } });

        let dropDown = $content.filter(".dx-dropdownmenu");
        assert.equal(dropDown.length, 1);
    });
});
