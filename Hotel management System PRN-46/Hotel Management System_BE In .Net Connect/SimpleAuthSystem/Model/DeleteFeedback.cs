using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace hotelManagementApplication.Model
{
    public class DeleteFeedbackRequest
    {
        [Required]
        public int FeedbackID { get; set; }
    }

    public class DeleteFeedbackResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
    }
}
