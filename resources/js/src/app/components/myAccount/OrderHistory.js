const ApiService = require("services/ApiService");

import TranslationService from "services/TranslationService";

Vue.component("order-history", {

    delimiters: ["${", "}"],

    props: {
        template:
        {
            type: String,
            default: "#vue-order-history"
        },
        orderDetailsTemplate:
        {
            type: String,
            default: "Ceres::Checkout.OrderDetails"
        }
    },

    data()
    {
        return {
            currentOrder: null,
            isLoading: false
        };
    },

    created()
    {
        this.$options.template = this.template;
    },

    methods:
    {
        setCurrentOrder(order)
        {
            $("#dynamic-twig-content").html("");
            this.isLoading = true;
            this.currentOrder = order;

            Vue.nextTick(() =>
            {
                $(this.$refs.orderDetails).modal("show");
            });

            ApiService
                .get("/rest/io/order/template?template=" + this.orderDetailsTemplate + "&orderId=" + order.order.id)
                .done(response =>
                {
                    this.isLoading = false;
                    $("#dynamic-twig-content").html(response);
                });
        },

        getPaymentStateText(paymentStates)
        {
            for (const paymentState in paymentStates)
            {
                if (paymentStates[paymentState].typeId == 4)
                {
                    return TranslationService.translate("Ceres::Template.orderHistoryPaymentStatus_" + paymentStates[paymentState].value);
                }
            }

            return "";
        }
    }
});
