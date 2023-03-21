using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementSystem.Model
{
    public class PayCustomerBillRequest
    {
        [Required]
        public int CustomerID { get; set; }
    }

    public class PayCustomerBillResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
