sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("com.ordermanagement.ordermanagement.controller.OrderMainPage", {

    // 📅 Format date as "01 Jan 2025"
    formatDate: function (dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date)) return "";
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-GB", options);
    },

    // 🚀 Initialization
    onInit() {
      const input = this.byId("orderNumberInput");
      input.attachBrowserEvent("paste", (e) => {
        const pasted = (e.clipboardData || window.clipboardData).getData("text");
        if (/[^0-9]/.test(pasted)) {
          e.preventDefault();
        }
      });

      // Attach updateFinished to count visible rows
      const oTable = this.byId("ordersTable");
      oTable.attachUpdateFinished((oEvent) => {
        const totalItems = oEvent.getParameter("total");
        this.byId("ordersTitle").setText(`Orders (${totalItems})`);
      });
      
      const oModel = oTable.getModel();
      console.log("Component model:", this.getOwnerComponent().getModel());


    },

    // 🔍 Filter Orders
    onFilter() {
      const oBundle = this.getView().getModel("i18n").getResourceBundle();
      const orderValue = this.byId("orderNumberInput").getValue();
      const dateValue = this.byId("creationDateInput").getValue();
      const statusValues = this.byId("statusMultiCombo").getSelectedKeys();

      if (orderValue && !/^\d+$/.test(orderValue)) {
        MessageToast.show(oBundle.getText("orderNumberInvalid"));
        return;
      }

      if (dateValue && isNaN(Date.parse(dateValue))) {
        MessageToast.show(oBundle.getText("creationDateInvalid"));
        return;
      }

      const aFilters = [];
      if (orderValue) {
        aFilters.push(new Filter("OrderNumber", FilterOperator.EQ, orderValue));
      }
      if (dateValue) {
        aFilters.push(new Filter("CreationDate", FilterOperator.EQ, dateValue));
      }
      if (statusValues.length > 0) {
        const statusFilters = statusValues.map(status =>
          new Filter("Status", FilterOperator.EQ, status)
        );
        aFilters.push(new Filter({ filters: statusFilters, and: false }));
      }

      const oTable = this.byId("ordersTable");
      const oBinding = oTable.getBinding("items");
      oBinding.filter(aFilters);
    },

    // 🧹 Clear Filters
    onClear() {
      const oView = this.getView();
      oView.byId("orderNumberInput").setValue("");
      oView.byId("creationDateInput").setValue("");
      oView.byId("statusMultiCombo").removeAllSelectedItems();

      const oTable = oView.byId("ordersTable");
      const oBinding = oTable.getBinding("items");
      oBinding.filter([]);
    },

    // 🗑️ Delete Selected Orders
    onDeletePress() {
      const oTable = this.byId("ordersTable");
      const aSelectedItems = oTable.getSelectedItems();

      if (aSelectedItems.length === 0) {
        MessageBox.error("Please select an item from the table");
        return;
      }

      MessageBox.confirm(
        `Are you sure you want to delete ${aSelectedItems.length} item(s)?`,
        {
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          emphasizedAction: MessageBox.Action.YES,
          onClose: (sAction) => {
            if (sAction === MessageBox.Action.YES) {
              const oModel = oTable.getModel();
              aSelectedItems.forEach((oItem) => {
                const oContext = oItem.getBindingContext();
                oModel.remove(oContext.getPath(), {
                  success: () => MessageToast.show("Item deleted successfully"),
                  error: () => MessageBox.error("Error while deleting item")
                });
              });
            }
          }
        }
      );
    },

    // 📋 Order Row Press
    onOrderSelect(oEvent) {
      const selectedOrder = oEvent.getSource().getBindingContext().getObject();
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteDetailPage", {
        orderId: selectedOrder.OrderNumber // assuming OrderNumber is the key
      });
    },

    // ➕ Navigate to Create Order Page
    onPressCreateOrder() {
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteCreateOrderPage");
    },

    // 🔢 Restrict Order Number to Digits Only
    onOrderNumberLiveChange(oEvent) {
      const input = oEvent.getSource();
      const value = input.getValue();
      const cleaned = value.replace(/[^0-9]/g, "");
      if (value !== cleaned) {
        input.setValue(cleaned);
      }
    },

    // 📅 Restrict Creation Date to Digits and Dashes
    onCreationDateLiveChange(oEvent) {
      const input = oEvent.getSource();
      const value = input.getValue();
      const cleaned = value.replace(/[^0-9\-]/g, "");
      if (value !== cleaned) {
        input.setValue(cleaned);
      }
    }

  });
});
