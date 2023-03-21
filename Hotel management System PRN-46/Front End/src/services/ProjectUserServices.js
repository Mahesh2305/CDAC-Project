import UserConfigurations from "../configurations/UserConfigurations";
import AxiosServices from "./AxiosServices";

const axiosServices = new AxiosServices();

export default class ProjectUserServices {
  InsertCustomerDetail(data) {
    return axiosServices.post(
      UserConfigurations.InsertCustomerDetail,
      data,
      false
    );
  }

  UpdateCustomerDetail(data) {
    return axiosServices.Put(
      UserConfigurations.UpdateCustomerDetail,
      data,
      false
    );
  }

  DeleteCustomerDetail(data) {
    return axiosServices.Delete(
      UserConfigurations.DeleteCustomerDetail + data,
      false
    );
  }

  PayCustomerBill(data) {
    return axiosServices.Patch(UserConfigurations.PayCustomerBill, data, false);
  }
}
