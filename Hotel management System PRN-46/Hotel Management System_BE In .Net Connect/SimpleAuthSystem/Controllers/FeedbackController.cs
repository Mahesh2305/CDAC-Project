using hotelManagementApplication.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimpleAuthSystem.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementSystem.Controllers
{
    [Route("api/[controller]/[Action]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IHotelManagementSystemDL _hotelManagementSystemDL;
        public FeedbackController(IHotelManagementSystemDL hotelManagementSystemDL)
        {
            _hotelManagementSystemDL = hotelManagementSystemDL;
        }

        [HttpPost]
        public async Task<IActionResult> GetFeedbacks(GetFeedbacksRequest request)
        {
            GetFeedbacksResponse response = new GetFeedbacksResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                response = await _hotelManagementSystemDL.GetFeedbacks(request);

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 3 : " + ex.Message;
            }
            

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> AddFeedback(AddFeedbackRequest request)
        {
            AddFeedbackResponse response = new AddFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                response = await _hotelManagementSystemDL.AddFeedback(request);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
            }
            
            return Ok(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFeedback([FromQuery]int ID)
        {
            DeleteFeedbackResponse response = new DeleteFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                response = await _hotelManagementSystemDL.DeleteFeedback(ID);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
            }

            return Ok(response);
        }

    }
}
