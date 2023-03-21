using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementSystem.Model
{
    public class GetCustomerDetailRequest
    {
        public int PageNumber { get; set; }
        public int NumberOfRecordPerPage { get; set; }
    }

    public class GetCustomerDetailResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int CurrentPage { get; set; }
        public double TotalRecords { get; set; }
        public int TotalPage { get; set; }
        public List<GetCustomerDetail> data { get; set; }
    }

    public class GetCustomerDetail
    {
        public int CustomerID { get; set; }
        public string InsertionDate { get; set; }
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
        public bool IsPaid { get; set; }
    }
}
