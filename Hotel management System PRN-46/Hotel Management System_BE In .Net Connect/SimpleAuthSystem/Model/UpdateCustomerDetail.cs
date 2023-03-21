using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementSystem.Model
{
    public class UpdateCustomerDetailRequest
    {
        [Required]
        public int CustomerID { get; set; }
        public string RoomType { get; set; }
        public string RoomScenerio { get; set; }
        public int RoomPrice { get; set; }
        public string CustomerName { get; set; }
        public string Contact { get; set; }
        public string EmailID { get; set; }
        public string Address { get; set; }
        public string Age { get; set; }
        public string CheckInTime { get; set; }
        public string CheckOutTime { get; set; }
        public string IDProof { get; set; }
        public string IDNumber { get; set; }
        public string PinCode { get; set; }
    }

    public class UpdateCustomerDetailResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
