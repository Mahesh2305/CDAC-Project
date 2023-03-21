using HotelManagementSystem.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SimpleAuthSystem.DataAccessLayer;
using System;
using System.Threading.Tasks;

namespace hotelManagementApplication.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IHotelManagementSystemDL _hotelManagementSystemDL;
        private readonly ILogger<UserController> _logger;
        public UserController(IHotelManagementSystemDL hotelManagementSystemDL, ILogger<UserController> logger)
        {
            _hotelManagementSystemDL = hotelManagementSystemDL;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> InsertCustomerDetail(InsertCustomerDetailRequest request)
        {
            InsertCustomerDetailResponse response = new InsertCustomerDetailResponse();
            try
            {
                _logger.LogInformation($"InsertCustomerDetail Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.InsertCustomerDetail(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateCustomerDetail(UpdateCustomerDetailRequest request)
        {
            UpdateCustomerDetailResponse response = new UpdateCustomerDetailResponse();
            try
            {
                _logger.LogInformation($"UpdateCustomerDetail Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.UpdateCustomerDetail(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCustomerDetail([FromQuery]int CustomerID)
        {
            DeleteCustomerDetailResponse response = new DeleteCustomerDetailResponse();
            try
            {
                _logger.LogInformation($"DeleteCustomerDetail Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.DeleteCustomerDetail(CustomerID);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPatch]
        public async Task<ActionResult> PayCustomerBill(PayCustomerBillRequest request)
        {
            PayCustomerBillResponse response = new PayCustomerBillResponse();
            try
            {
                _logger.LogInformation($"PayCustomerBill Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.PayCustomerBill(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

    }
}
