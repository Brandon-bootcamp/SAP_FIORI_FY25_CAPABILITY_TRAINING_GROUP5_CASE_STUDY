/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["com/ordermanagement/ordermanagement/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
