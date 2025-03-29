import useApiClient from "../../services/ApiClient";
import { BillingFilterParameters } from "./stores";
import { ICommissionForm, IPaymentForm } from "./types";

export const useBillingServices = () => {
  const { sendRequest } = useApiClient();

  const getBillingStatistics = async (_p: BillingFilterParameters) => {
    return sendRequest({
      method: "get",
      url: "/stats/billing/",
      params: {
        // created_at__gte: p.startDate,
        // created_at__lte: p.endDate,
      },
    });
  };

  const getBillings = async (p: BillingFilterParameters, page: number) => {
    const url = "/operation/billing/";
    return sendRequest({
      method: "get",
      url: url,
      params: {
        created_at__gte: p.startDate,
        created_at__lte: p.endDate,
        limit: 10,
        page: page,
      },
    });
  };

  const getBillingDetails = async (billing_id: string) => {
    const url = `/operation/billing/${billing_id}`;
    return sendRequest({
      method: "get",
      url: url,
      params: {},
    });
  };

  const getBillingPayments = async (billing_id: string) => {
    const url = `/operation/billing_payment/`;
    return sendRequest({
      method: "get",
      url: url,
      params: {
        confirmed: false,
        billing: billing_id,
      },
    });
  };

  const postBillingPayment = async (d: IPaymentForm, billing: string) => {
    const url = "/operation/billing_payment/";
    return sendRequest({
      method: "post",
      url: url,
      data: {
        amount: d.amount,
        billing: billing,
      },
    });
  };

  const postCommissionPayment = async (
    d: ICommissionForm,
    billing: string
  ) => {
    const url = "/operation/transaction/";
    return sendRequest({
      method: "post",
      url: url,
      data: {
        phone_number: d.phoneCountry + d.phone_number,
        billing: billing,
      },
    });
  };
  
  const patchConfirmBillingPayment = async (payment_id: string) => {
    const url = `/operation/billing_payment/${payment_id}/`;
    return sendRequest({
      method: "patch",
      url: url,
      data: {
        confirmed: true,
      },
    });
  };

  return {
    getBillingStatistics,
    getBillings,
    getBillingDetails,
    postBillingPayment,
    patchConfirmBillingPayment,
    getBillingPayments,
    postCommissionPayment,
  };
};
