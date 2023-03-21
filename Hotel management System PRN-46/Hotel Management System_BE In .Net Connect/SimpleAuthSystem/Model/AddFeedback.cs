using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace hotelManagementApplication.Model
{
    public class AddFeedbackRequest
    {
        [Required]
        public string Feedback { get; set; }
    }

    public class AddFeedbackResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
