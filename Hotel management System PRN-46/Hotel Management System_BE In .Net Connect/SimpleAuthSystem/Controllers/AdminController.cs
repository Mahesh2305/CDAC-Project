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
    public class AdminController : ControllerBase
    {
        private readonly IHotelManagementSystemDL _hotelManagementSystemDL;
        private readonly ILogger<AdminController> _logger;
        public AdminController(IHotelManagementSystemDL hotelManagementSystemDL, ILogger<AdminController> logger)
        {
            _hotelManagementSystemDL = hotelManagementSystemDL;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult> InsertMasterData(InsertMasterDataRequest request)
        {
            InsertMasterDataResponse response = new InsertMasterDataResponse();
            try
            {
                _logger.LogInformation($"InsertMasterData Calling In AdminController.... Time : {DateTime.Now}");
                response =  await _hotelManagementSystemDL.InsertMasterData(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpGet]
        public async Task<ActionResult> GetMasterData()
        {
            GetMasterDataResponse response = new GetMasterDataResponse();
            try
            {
                _logger.LogInformation($"InsertMasterData Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.GetMasterData();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError("Exception Occur In AuthController : Message : ", ex.Message);
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> GetCustomerDetail(GetCustomerDetailRequest request)
        {
            GetCustomerDetailResponse response = new GetCustomerDetailResponse();
            try
            {
                _logger.LogInformation($"GetCustomerDetail Calling In AdminController.... Time : {DateTime.Now}");
                response = await _hotelManagementSystemDL.GetCustomerDetail(request);
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
