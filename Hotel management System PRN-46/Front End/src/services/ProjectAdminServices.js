import AdminConfigurations from "../configurations/AdminConfigurations";
import AxiosServices from "./AxiosServices";

const axiosServices = new AxiosServices();

export default class ProjectAdminServices {
  InsertMasterData(data) {
    // debugger
    return axiosServices.post(
      AdminConfigurations.InsertMasterData,
      data,
      false
    );
  }

  GetMasterData() {
    return axiosServices.Get(AdminConfigurations.GetMasterData, false);
  }

  GetCustomerDetail(data) {
    return axiosServices.post(
      AdminConfigurations.GetCustomerDetail,
      data,
      false
    );
  }

  UpdateCustomerDetail(data) {
    return axiosServices.Put(
      AdminConfigurations.UpdateCustomerDetail,
      data,
      false
    );
  }

  DeleteCustomerDetail(data) {
    return axiosServices.Delete(
      AdminConfigurations.DeleteCustomerDetail + data,
      false
    );
  }

  PayCustomerBill(data) {
    return axiosServices.Patch(
      AdminConfigurations.PayCustomerBill,
      data,
      false
    );
  }
}
