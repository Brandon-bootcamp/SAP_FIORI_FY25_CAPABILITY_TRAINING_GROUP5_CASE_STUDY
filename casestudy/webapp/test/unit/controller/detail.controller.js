/*global QUnit*/

sap.ui.define([
	"casestudy/controller/detail.controller"
], function (Controller) {
	"use strict";

	QUnit.module("detail Controller");

	QUnit.test("I should test the detail controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
