/*global QUnit*/

sap.ui.define([
	"com/ordermanagement/ordermanagement/controller/OrderManagement.controller"
], function (Controller) {
	"use strict";

	QUnit.module("OrderManagement Controller");

	QUnit.test("I should test the OrderManagement controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
