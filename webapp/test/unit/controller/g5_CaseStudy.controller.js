/*global QUnit*/

sap.ui.define([
	"casestudy/controller/g5_CaseStudy.controller"
], function (Controller) {
	"use strict";

	QUnit.module("g5_CaseStudy Controller");

	QUnit.test("I should test the g5_CaseStudy controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
