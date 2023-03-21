using HotelManagementSystem.Model;
using hotelManagementApplication.Model;
using SimpleAuthSystem.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleAuthSystem.DataAccessLayer
{
    public interface IHotelManagementSystemDL
    {
        public Task<SignUpResponse> SignUp(SignUpRequest request);

        public Task<SignInResponse> SignIn(SignInRequest request);

        //Admin

        public Task<InsertMasterDataResponse> InsertMasterData(InsertMasterDataRequest request);
        public Task<GetMasterDataResponse> GetMasterData();
        public Task<GetCustomerDetailResponse> GetCustomerDetail(GetCustomerDetailRequest request);

        // Feedback

        public Task<GetFeedbacksResponse> GetFeedbacks(GetFeedbacksRequest request);
        public Task<AddFeedbackResponse> AddFeedback(AddFeedbackRequest request);
        public Task<DeleteFeedbackResponse> DeleteFeedback(int ID);

        // User
        public Task<InsertCustomerDetailResponse> InsertCustomerDetail(InsertCustomerDetailRequest request);
        public Task<UpdateCustomerDetailResponse> UpdateCustomerDetail(UpdateCustomerDetailRequest request);
        public Task<DeleteCustomerDetailResponse> DeleteCustomerDetail(int CustomerID);
        public Task<PayCustomerBillResponse> PayCustomerBill(PayCustomerBillRequest request);

    }
}
