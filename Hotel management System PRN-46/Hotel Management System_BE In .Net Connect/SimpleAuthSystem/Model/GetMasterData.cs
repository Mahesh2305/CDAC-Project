using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManagementSystem.Model
{
    public class GetMasterDataResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public GetMasterData data { get; set; }
    }
    public class GetMasterData
    {
        public int TotalRoom { get; set; }
        public int AvailableRoom { get; set; }
        public int TotalAcRoom { get; set; }
        public int AvailableAcRoom { get; set; }
        public int TotalSingleBedAcRoom { get; set; }
        public int AvailableSingleBedAcRoom { get; set; }
        public int SingleBedAcRoomPrice { get; set; }
        public int TotalDoubleBedAcRoom { get; set; }
        public int AvailableDoubleBedAcRoom { get; set; }
        public int DoubleBedAcRoomPrice { get; set; }
        public int TotalNonAcRoom { get; set; }
        public int AvailableNonAcRoom { get; set; }
        public int TotalSingleBedNonAcRoom { get; set; }
        public int AvailableSingleBedNonAcRoom { get; set; }
        public int SingleBedNonAcRoomPrice { get; set; }
        public int TotalDoubleBedNonAcRoom { get; set; } //
        public int AvailableDoubleBedNonAcRoom { get; set; } //
        public int DoubleBedNonAcRoomPrice { get; set; }
    }
}
