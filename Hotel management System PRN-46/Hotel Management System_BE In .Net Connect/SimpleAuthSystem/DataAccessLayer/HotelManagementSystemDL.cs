using HotelManagementSystem.Model;
using hotelManagementApplication.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using SimpleAuthSystem.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace SimpleAuthSystem.DataAccessLayer
{
    public class HotelManagementSystemDL : IHotelManagementSystemDL
    {
        public readonly IConfiguration _configuration;
        public readonly MySqlConnection _SqlConnection;
        private readonly ILogger<HotelManagementSystemDL> _logger;

        public HotelManagementSystemDL(IConfiguration configuration, ILogger<HotelManagementSystemDL> logger)
        {
            _logger = logger;
            _configuration = configuration;
            if (DateTime.Now < Convert.ToDateTime(_configuration["Master"].ToString()))
            {
                _SqlConnection = new MySqlConnection(_configuration["ConnectionStrings:MySqlDBConnection"]);
            }

        }

        // Authentication

        public async Task<SignInResponse> SignIn(SignInRequest request)
        {
            SignInResponse response = new SignInResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            try
            {
                _logger.LogInformation($"SignIn In DataAccessLayer Calling .... {JsonConvert.SerializeObject(request)}");
                if (_SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT UserId, UserName, Role, InsertionDate
                                    FROM UserDetail 
                                    WHERE UserName=@UserName AND PassWord=@PassWord AND Role=@Role;";



                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.Parameters.AddWithValue("@UserName", request.UserName);
                        sqlCommand.Parameters.AddWithValue("@PassWord", request.Password);
                        sqlCommand.Parameters.AddWithValue("@Role", request.Role);
                        using (DbDataReader dataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dataReader.HasRows)
                            {
                                response.data = new SignIn();
                                response.Message = "Login Successfully";
                                await dataReader.ReadAsync();
                                response.data.UserId = dataReader["UserId"] != DBNull.Value ? (int)dataReader["UserId"] : -1;
                                response.data.UserName = dataReader["UserName"] != DBNull.Value ? (string)dataReader["UserName"] : string.Empty;
                                response.data.Role = dataReader["Role"] != DBNull.Value ? (string)dataReader["Role"] : string.Empty;
                                response.data.InsertionDate = dataReader["InsertionDate"] != DBNull.Value ? Convert.ToDateTime(dataReader["InsertionDate"]).ToString("dddd, dd-MM-yyyy, HH:mm tt") : string.Empty;
                                response.data.Role = response.data.Role != "customer" ? "manager" : "customer";
                            }
                            else
                            {
                                response.IsSuccess = false;
                                response.Message = "Login Unsuccessfully";
                                _logger.LogInformation($"Login Unsuccessfully UserName : {request.UserName}, Role : {request.Role}");
                                return response;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");

            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<SignUpResponse> SignUp(SignUpRequest request)
        {
            SignUpResponse response = new SignUpResponse();
            response.IsSuccess = true;
            response.Message = "Registration Successful";
            try
            {
                _logger.LogInformation($"SignUp In DataAccessLayer Calling .... Request Body {JsonConvert.SerializeObject(request)}");

                if (request.Role.ToLower() == "manager" && request.MasterPassword != "India@123")
                {
                    response.IsSuccess = false;
                    response.Message = "Invalid Master Password";
                    return response;
                }

                if (!request.Password.Equals(request.ConfigPassword))
                {
                    response.IsSuccess = false;
                    response.Message = "Password & Confirm Password not Match";
                    return response;
                }

                if (_SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlStoreProcedure = @"Select * from UserDetail where UserName=@UserName";



                using (MySqlCommand sqlCommand = new MySqlCommand(SqlStoreProcedure, _SqlConnection))
                {
                    sqlCommand.CommandType = CommandType.Text;
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.Parameters.AddWithValue("@UserName", request.UserName);
                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.IsSuccess = false;
                                response.Message = "UserName Already Exist";
                                return response;
                            }
                        }
                        catch (Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = ex.Message;
                            _logger.LogError($"Exception Occurs : Message 2 : {ex.Message}");
                        }
                    }
                }

                SqlStoreProcedure = @"insert into UserDetail
                                             (UserName, PassWord, Role) 
                                            values 
                                            (@UserName,@PassWord,@Role);";


                using (MySqlCommand sqlCommand = new MySqlCommand(SqlStoreProcedure, _SqlConnection))
                {
                    //EXEC SpAdminSignUp 'Vishal', 'Vishal@123', 'manager', 'India@123'
                    sqlCommand.CommandType = CommandType.Text;
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.Parameters.AddWithValue("@UserName", request.UserName);
                    sqlCommand.Parameters.AddWithValue("@PassWord", request.Password);
                    sqlCommand.Parameters.AddWithValue("@Role", request.Role.ToLower());
                    //sqlCommand.Parameters.AddWithValue("@MasterPassWord", request.MasterPassword);
                    int Status = await sqlCommand.ExecuteNonQueryAsync();
                    if (Status <= 0)
                    {
                        response.IsSuccess = false;
                        response.Message = "Registration Unsuccessfull";
                        _logger.LogError("Registration Unsuccessfull");
                        return response;
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : {ex.Message}");
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        // Admin

        public async Task<InsertMasterDataResponse> InsertMasterData(InsertMasterDataRequest request)
        {
            InsertMasterDataResponse response = new InsertMasterDataResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            int IsFound = 0;
            try
            {

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"Select * from fact_master_details";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = CommandType.Text;
                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                IsFound = 1;
                            }

                        }
                        catch (Exception ex)
                        {
                            response.IsSuccess = true;
                            response.Message = "Exception Occurs : Message 0 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 0 : ", ex.Message);
                        }
                    }
                }

                if (IsFound == 0)
                {
                    SqlQuery = @"
                                    insert into fact_master_details( MasterUserName, MasterPassword, Role, IsActive,
                                    TotalRoom, AvailableRoom, TotalAcRoom, 
                                    AvailableAcRoom, TotalSingleBedAcRoom, AvailableSingleBedAcRoom,
                                    SingleBedAcRoomPrice, TotalDoubleBedAcRoom, AvailableDoubleBedAcRoom,
                                    DoubleBedAcRoomPrice, TotalNonAcRoom, AvailableNonAcRoom,
                                    TotalSingleBedNonAcRoom, AvailableSingleBedNonAcRoom, SingleBedNonAcRoomPrice,
                                    TotalDoubleBedNonAcRoom, AvailableDoubleBedNonAcRoom, DoubleBedNonAcRoomPrice
                                    )
                                    value ( 'India','India@123','master', 1,
                                    @TotalRoom, @AvailableRoom, @TotalAcRoom, 
                                    @AvailableAcRoom, @TotalSingleBedAcRoom, @AvailableSingleBedAcRoom,
                                    @SingleBedAcRoomPrice, @TotalDoubleBedAcRoom, @AvailableDoubleBedAcRoom,
                                    @DoubleBedAcRoomPrice, @TotalNonAcRoom, @AvailableNonAcRoom,
                                    @TotalSingleBedNonAcRoom, @AvailableSingleBedNonAcRoom, @SingleBedNonAcRoomPrice,
                                    @TotalDoubleBedNonAcRoom, @AvailableDoubleBedNonAcRoom, @DoubleBedNonAcRoomPrice
                                    );  
                                ";
                }
                else
                {
                    SqlQuery = @"
                                    TRUNCATE TABLE CustomerDetails;

                                    UPDATE fact_master_details 
                                    SET TotalRoom=@TotalRoom, 
                                        AvailableRoom=@AvailableRoom, 
                                        TotalAcRoom=@TotalAcRoom, 
                                        AvailableAcRoom=@AvailableAcRoom, 
                                        TotalSingleBedAcRoom=@TotalSingleBedAcRoom, 
                                        AvailableSingleBedAcRoom=@AvailableSingleBedAcRoom, 
                                        SingleBedAcRoomPrice=@SingleBedAcRoomPrice,
                                        TotalDoubleBedAcRoom=@TotalDoubleBedAcRoom, 
                                        AvailableDoubleBedAcRoom=@AvailableDoubleBedAcRoom, 
                                        DoubleBedAcRoomPrice=@DoubleBedAcRoomPrice, 
                                        TotalNonAcRoom=@TotalNonAcRoom, 
                                        AvailableNonAcRoom=@AvailableNonAcRoom,
                                        TotalSingleBedNonAcRoom=@TotalSingleBedNonAcRoom, 
                                        AvailableSingleBedNonAcRoom=@AvailableSingleBedNonAcRoom, 
                                        SingleBedNonAcRoomPrice=@SingleBedNonAcRoomPrice, 
                                        TotalDoubleBedNonAcRoom=@TotalDoubleBedNonAcRoom, 
                                        AvailableDoubleBedNonAcRoom=@AvailableDoubleBedNonAcRoom, 
                                        DoubleBedNonAcRoomPrice=@DoubleBedNonAcRoomPrice
                                    WHERE Role='master';";
                }
                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;

                        // TotalRoom, AvailableRoom
                        sqlCommand.Parameters.AddWithValue("@TotalRoom", request.TotalRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableRoom", request.TotalRoom);

                        //TotalAcRoom, AvailableAcRoom 
                        sqlCommand.Parameters.AddWithValue("@TotalAcRoom", request.TotalAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableAcRoom", request.TotalAcRoom);

                        //TotalSingleBedAcRoom, AvailableSingleBedAcRoom, SingleBedAcRoomPrice
                        sqlCommand.Parameters.AddWithValue("@TotalSingleBedAcRoom", request.TotalSingleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedAcRoom", request.TotalSingleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@SingleBedAcRoomPrice", request.SingleBedAcRoomPrice);

                        //TotalDoubleBedAcRoom, AvailableDoubleBedAcRoom, DoubleBedAcRoomPrice 
                        sqlCommand.Parameters.AddWithValue("@TotalDoubleBedAcRoom", request.TotalDoubleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedAcRoom", request.TotalDoubleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@DoubleBedAcRoomPrice", request.DoubleBedAcRoomPrice);

                        //TotalNonAcRoom, AvailableNonAcRoom
                        sqlCommand.Parameters.AddWithValue("@TotalNonAcRoom", request.TotalNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableNonAcRoom", request.TotalNonAcRoom);

                        //TotalSingleBedNonAcRoom, AvailableSingleBedNonAcRoom, SingleBedNonAcRoomPrice 
                        sqlCommand.Parameters.AddWithValue("@TotalSingleBedNonAcRoom", request.TotalSingleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedNonAcRoom", request.TotalSingleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@SingleBedNonAcRoomPrice", request.SingleBedNonAcRoomPrice);

                        //TotalDoubleBedNonAcRoom, AvailableTotalNonAcRoom, DoubleBedNonAcRoomPrice
                        sqlCommand.Parameters.AddWithValue("@TotalDoubleBedNonAcRoom", request.TotalDoubleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedNonAcRoom", request.TotalDoubleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@DoubleBedNonAcRoomPrice", request.DoubleBedNonAcRoomPrice);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In InsertMasterData");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }


            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message : " + ex.Message;
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<GetMasterDataResponse> GetMasterData()
        {
            GetMasterDataResponse response = new GetMasterDataResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }


                string SqlQuery = @"SELECT 
                                    TotalRoom, AvailableRoom, 
                                    TotalAcRoom, AvailableAcRoom, 
                                    TotalSingleBedAcRoom, AvailableSingleBedAcRoom, SingleBedAcRoomPrice,
                                    TotalDoubleBedAcRoom, AvailableDoubleBedAcRoom, DoubleBedAcRoomPrice, 
                                    TotalNonAcRoom, AvailableNonAcRoom,
                                    TotalSingleBedNonAcRoom, AvailableSingleBedNonAcRoom, SingleBedNonAcRoomPrice, 
                                    TotalDoubleBedNonAcRoom, AvailableDoubleBedNonAcRoom, DoubleBedNonAcRoomPrice
                                    FROM fact_master_details 
                                    WHERE IsActive=1";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.CommandTimeout = 180;
                        using (DbDataReader dataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dataReader.HasRows)
                            {
                                response.data = new GetMasterData();
                                await dataReader.ReadAsync();
                                response.data.TotalRoom = dataReader["TotalRoom"] != DBNull.Value ? (int)dataReader["TotalRoom"] : -1;
                                response.data.AvailableRoom = dataReader["AvailableRoom"] != DBNull.Value ? (int)dataReader["AvailableRoom"] : -1;
                                response.data.TotalAcRoom = dataReader["TotalAcRoom"] != DBNull.Value ? (int)dataReader["TotalAcRoom"] : -1;
                                response.data.AvailableAcRoom = dataReader["AvailableAcRoom"] != DBNull.Value ? (int)dataReader["AvailableAcRoom"] : -1;
                                response.data.TotalSingleBedAcRoom = dataReader["TotalSingleBedAcRoom"] != DBNull.Value ? (int)dataReader["TotalSingleBedAcRoom"] : -1;
                                response.data.AvailableSingleBedAcRoom = dataReader["AvailableSingleBedAcRoom"] != DBNull.Value ? (int)dataReader["AvailableSingleBedAcRoom"] : -1;
                                response.data.SingleBedAcRoomPrice = dataReader["SingleBedAcRoomPrice"] != DBNull.Value ? (int)dataReader["SingleBedAcRoomPrice"] : -1;
                                response.data.TotalDoubleBedAcRoom = dataReader["TotalDoubleBedAcRoom"] != DBNull.Value ? (int)dataReader["TotalDoubleBedAcRoom"] : -1;
                                response.data.AvailableDoubleBedAcRoom = dataReader["AvailableDoubleBedAcRoom"] != DBNull.Value ? (int)dataReader["AvailableDoubleBedAcRoom"] : -1;
                                response.data.DoubleBedAcRoomPrice = dataReader["DoubleBedAcRoomPrice"] != DBNull.Value ? (int)dataReader["DoubleBedAcRoomPrice"] : -1;
                                response.data.TotalNonAcRoom = dataReader["TotalNonAcRoom"] != DBNull.Value ? (int)dataReader["TotalNonAcRoom"] : -1;
                                response.data.AvailableNonAcRoom = dataReader["AvailableNonAcRoom"] != DBNull.Value ? (int)dataReader["AvailableNonAcRoom"] : -1;
                                response.data.TotalSingleBedNonAcRoom = dataReader["TotalSingleBedNonAcRoom"] != DBNull.Value ? (int)dataReader["TotalSingleBedNonAcRoom"] : -1;
                                response.data.AvailableSingleBedNonAcRoom = dataReader["AvailableSingleBedNonAcRoom"] != DBNull.Value ? (int)dataReader["AvailableSingleBedNonAcRoom"] : -1;
                                response.data.SingleBedNonAcRoomPrice = dataReader["SingleBedNonAcRoomPrice"] != DBNull.Value ? (int)dataReader["SingleBedNonAcRoomPrice"] : -1;
                                response.data.TotalDoubleBedNonAcRoom = dataReader["TotalDoubleBedNonAcRoom"] != DBNull.Value ? (int)dataReader["TotalDoubleBedNonAcRoom"] : -1;
                                response.data.AvailableDoubleBedNonAcRoom = dataReader["AvailableDoubleBedNonAcRoom"] != DBNull.Value ? (int)dataReader["AvailableDoubleBedNonAcRoom"] : -1;
                                response.data.DoubleBedNonAcRoomPrice = dataReader["DoubleBedNonAcRoomPrice"] != DBNull.Value ? (int)dataReader["DoubleBedNonAcRoomPrice"] : -1;
                            }

                        }
                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");
                    }
                }


            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message : " + ex.Message;
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<GetCustomerDetailResponse> GetCustomerDetail(GetCustomerDetailRequest request)
        {
            GetCustomerDetailResponse response = new GetCustomerDetailResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetCustomerDetail In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }
                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = @"SELECT  CustomerID,
                                            InsertionDate,
                                            RoomType, 
                                            RoomScenerio, 
                                            RoomPrice,
                                            CustomerName, 
                                            Contact,
                                            EmailID,
                                            Address,
                                            Age,
                                            CheckInTime, 
                                            CheckOutTime, 
                                            IDProof,
                                            IDNumber, 
                                            PinCode ,
                                            IsPaid,
                                            (select COUNT(*) from CustomerDetails) As TotalRecord
                                    FROM CustomerDetails 
                                    ORDER BY CustomerID DESC
                                    LIMIT @Offset, @NumberOfRecordPerPage;
                                    ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                        sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            try
                            {
                                if (dbDataReader.HasRows)
                                {
                                    int Count = 0;
                                    response.data = new List<GetCustomerDetail>();
                                    while (await dbDataReader.ReadAsync())
                                    {
                                        GetCustomerDetail GetData = new GetCustomerDetail();

                                        GetData.CustomerID = dbDataReader["CustomerID"] != DBNull.Value ? (int)dbDataReader["CustomerID"] : -1;
                                        GetData.InsertionDate = dbDataReader["InsertionDate"] != DBNull.Value ? (string)dbDataReader["InsertionDate"] : string.Empty;
                                        GetData.RoomType = dbDataReader["RoomType"] != DBNull.Value ? (string)dbDataReader["RoomType"] : string.Empty;
                                        GetData.RoomScenerio = dbDataReader["RoomScenerio"] != DBNull.Value ? (string)dbDataReader["RoomScenerio"] : string.Empty;
                                        GetData.RoomPrice = dbDataReader["RoomPrice"] != DBNull.Value ? (int)dbDataReader["RoomPrice"] : -1;
                                        GetData.CustomerName = dbDataReader["CustomerName"] != DBNull.Value ? (string)dbDataReader["CustomerName"] : string.Empty;
                                        GetData.Contact = dbDataReader["Contact"] != DBNull.Value ? (string)dbDataReader["Contact"] : string.Empty;
                                        GetData.EmailID = dbDataReader["EmailID"] != DBNull.Value ? (string)dbDataReader["EmailID"] : string.Empty;
                                        GetData.Address = dbDataReader["Address"] != DBNull.Value ? (string)dbDataReader["Address"] : string.Empty;
                                        GetData.Age = dbDataReader["Age"] != DBNull.Value ? Convert.ToString(dbDataReader["Age"]) : string.Empty;
                                        GetData.CheckInTime = dbDataReader["CheckInTime"] != DBNull.Value ? (string)dbDataReader["CheckInTime"] : string.Empty;
                                        GetData.CheckOutTime = dbDataReader["CheckOutTime"] != DBNull.Value ? (string)dbDataReader["CheckOutTime"] : string.Empty;
                                        GetData.IDProof = dbDataReader["IDProof"] != DBNull.Value ? (string)dbDataReader["IDProof"] : string.Empty;
                                        GetData.IDNumber = dbDataReader["IDNumber"] != DBNull.Value ? (string)dbDataReader["IDNumber"] : string.Empty;
                                        GetData.PinCode = dbDataReader["PinCode"] != DBNull.Value ? (string)dbDataReader["PinCode"] : string.Empty;
                                        GetData.IsPaid = dbDataReader["IsPaid"] != DBNull.Value ? ((UInt64)dbDataReader["IsPaid"]) == 1 ? true : false : false;


                                        response.data.Add(GetData);
                                        if (Count == 0)
                                        {
                                            Count++;
                                            response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                            response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                            response.CurrentPage = request.PageNumber;
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                response.IsSuccess = false;
                                response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                                _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 3 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 3 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        // FeedBack

        public async Task<GetFeedbacksResponse> GetFeedbacks(GetFeedbacksRequest request)
        {
            GetFeedbacksResponse response = new GetFeedbacksResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetFeedbacks In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }
                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = @"SELECT * ,
                                    (select COUNT(*) from FeedbackDetail) As TotalRecord
                                    FROM FeedbackDetail 
                                    ORDER BY FeedbackID DESC
                                    LIMIT @Offset, @NumberOfRecordPerPage;
                                    ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                        sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            try
                            {
                                if (dbDataReader.HasRows)
                                {
                                    int Count = 0;
                                    response.data = new List<GetFeedbacks>();
                                    while (await dbDataReader.ReadAsync())
                                    {
                                        response.data.Add(new GetFeedbacks()
                                        {
                                            FeedbackID = dbDataReader["FeedbackID"] != DBNull.Value ? (int)dbDataReader["FeedbackID"] : -1,
                                            FeedBack = dbDataReader["Feedback"] != DBNull.Value ? (string)dbDataReader["Feedback"] : string.Empty
                                        });

                                        if (Count == 0)
                                        {
                                            Count++;
                                            response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                            response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                            response.CurrentPage = request.PageNumber;
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                response.IsSuccess = false;
                                response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                                _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 3 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 3 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<AddFeedbackResponse> AddFeedback(AddFeedbackRequest request)
        {
            AddFeedbackResponse response = new AddFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"AddFeedback In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"INSERT INTO FeedbackDetail (FeedBack)
                                    VALUES(@FeedBack);";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@FeedBack", request.Feedback);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In AddFeedBack");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<DeleteFeedbackResponse> DeleteFeedback(int ID)
        {
            DeleteFeedbackResponse response = new DeleteFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"DeleteFeedback In DataAccessLayer Calling .... request ID : {ID}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"DELETE FROM FeedbackDetail WHERE FeedbackID=@ID;";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@ID", ID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In DeleteFeedback");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        // User
        public async Task<InsertCustomerDetailResponse> InsertCustomerDetail(InsertCustomerDetailRequest request)
        {
            InsertCustomerDetailResponse response = new InsertCustomerDetailResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            int AvailableRoom = 0, AvailableAcRoom = 0, AvailableSingleBedAcRoom = 0, AvailableDoubleBedAcRoom = 0, AvailableNonAcRoom = 0, AvailableSingleBedNonAcRoom = 0, AvailableDoubleBedNonAcRoom = 0;
            try
            {

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT AvailableRoom, 
                                           AvailableAcRoom, 
                                           AvailableSingleBedAcRoom, 
                                           AvailableDoubleBedAcRoom,
                                           AvailableNonAcRoom, 
                                           AvailableSingleBedNonAcRoom, 
                                           AvailableDoubleBedNonAcRoom
                                    FROM fact_master_details";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {

                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dbDataReader.HasRows)
                            {
                                await dbDataReader.ReadAsync();
                                AvailableRoom = dbDataReader["AvailableRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableRoom"] : 0;
                                AvailableAcRoom = dbDataReader["AvailableAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableAcRoom"] : 0;
                                AvailableSingleBedAcRoom = dbDataReader["AvailableSingleBedAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableSingleBedAcRoom"] : 0;
                                AvailableDoubleBedAcRoom = dbDataReader["AvailableDoubleBedAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableDoubleBedAcRoom"] : 0;
                                AvailableNonAcRoom = dbDataReader["AvailableNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableNonAcRoom"] : 0;
                                AvailableSingleBedNonAcRoom = dbDataReader["AvailableSingleBedNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableSingleBedNonAcRoom"] : 0;
                                AvailableDoubleBedNonAcRoom = dbDataReader["AvailableDoubleBedNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableDoubleBedNonAcRoom"] : 0;
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message : " + ex.Message;
                    }
                    finally
                    {
                        await sqlCommand.DisposeAsync();
                    }
                }

                //AC/Non Ac
                //Single Bed/ Double Bed
                AvailableRoom -= 1;
                if (request.RoomType.ToLowerInvariant().Equals("ac"))
                {
                    AvailableAcRoom -= 1;
                    if (request.RoomScenerio.ToLowerInvariant().Equals("single bed"))
                    {
                        AvailableSingleBedAcRoom -= 1;
                    }
                    else if (request.RoomScenerio.ToLowerInvariant().Equals("double bed"))
                    {
                        AvailableDoubleBedAcRoom -= 1;
                    }
                }
                else if (request.RoomType.ToLowerInvariant().Equals("non ac"))
                {
                    AvailableNonAcRoom -= 1;
                    if (request.RoomScenerio.ToLowerInvariant().Equals("single bed"))
                    {
                        AvailableSingleBedNonAcRoom -= 1;
                    }
                    else if (request.RoomScenerio.ToLowerInvariant().Equals("double bed"))
                    {
                        AvailableDoubleBedNonAcRoom -= 1;
                    }
                }

                SqlQuery = @"

                                           UPDATE fact_master_details
                                           SET AvailableRoom = @AvailableRoom, 
                                               AvailableAcRoom = @AvailableAcRoom, 
                                               AvailableSingleBedAcRoom = @AvailableSingleBedAcRoom, 
                                               AvailableDoubleBedAcRoom = @AvailableDoubleBedAcRoom,
                                               AvailableNonAcRoom = @AvailableNonAcRoom, 
                                               AvailableSingleBedNonAcRoom = @AvailableSingleBedNonAcRoom, 
                                               AvailableDoubleBedNonAcRoom = @AvailableDoubleBedNonAcRoom
                                           WHERE Role = 'master';


                                           INSERT INTO CustomerDetails
                                           (RoomType, 
                                            RoomScenerio, 
                                            RoomPrice,
                                            CustomerName, 
                                            Contact,
                                            EmailID,
                                            Address,
                                            Age,
                                            CheckInTime, 
                                            CheckOutTime, 
                                            IDProof,
                                            IDNumber, 
                                            PinCode) 
                                    VALUES
                                           (@RoomType, 
                                            @RoomScenerio, 
                                            @RoomPrice,
                                            @CustomerName, 
                                            @Contact,
                                            @EmailID,
                                            @Address,
                                            @Age, 
                                            @CheckInTime, 
                                            @CheckOutTime, 
                                            @IDProof,
                                            @IDNumber, 
                                            @PinCode)
                                    ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;

                        // Update Master Table
                        sqlCommand.Parameters.AddWithValue("@AvailableRoom", AvailableRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableAcRoom", AvailableAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedAcRoom", AvailableSingleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedAcRoom", AvailableDoubleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableNonAcRoom", AvailableNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedNonAcRoom", AvailableSingleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedNonAcRoom", AvailableDoubleBedNonAcRoom);

                        //Insert New Record
                        sqlCommand.Parameters.AddWithValue("@RoomType", request.RoomType);
                        sqlCommand.Parameters.AddWithValue("@RoomScenerio", request.RoomScenerio);
                        sqlCommand.Parameters.AddWithValue("@RoomPrice", request.RoomPrice);
                        sqlCommand.Parameters.AddWithValue("@CustomerName", request.CustomerName);
                        sqlCommand.Parameters.AddWithValue("@Contact", request.Contact);
                        sqlCommand.Parameters.AddWithValue("@EmailID", request.EmailID);
                        sqlCommand.Parameters.AddWithValue("@Address", request.Address);
                        sqlCommand.Parameters.AddWithValue("@Age", request.Age);
                        sqlCommand.Parameters.AddWithValue("@CheckInTime", request.CheckInTime);
                        sqlCommand.Parameters.AddWithValue("@CheckOutTime", request.CheckOutTime);
                        sqlCommand.Parameters.AddWithValue("@IDProof", request.IDProof);
                        sqlCommand.Parameters.AddWithValue("@IDNumber", request.IDNumber);
                        sqlCommand.Parameters.AddWithValue("@PinCode", request.PinCode);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In InsertCustomerDetail");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }


            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message : " + ex.Message;
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<UpdateCustomerDetailResponse> UpdateCustomerDetail(UpdateCustomerDetailRequest request)
        {
            UpdateCustomerDetailResponse response = new UpdateCustomerDetailResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"UPDATE CustomerDetails
                                    SET RoomType=@RoomType, 
                                        RoomScenerio=@RoomScenerio, 
                                        RoomPrice=@RoomPrice,
                                        CustomerName=@CustomerName, 
                                        Contact=@Contact,
                                        EmailID=@EmailID,
                                        Address=@Address,
                                        Age=@Age,
                                        CheckInTime=@CheckInTime, 
                                        CheckOutTime=@CheckOutTime, 
                                        IDProof=@IDProof,
                                        IDNumber=@IDNumber, 
                                        PinCode=@PinCode
                                    WHERE CustomerID=@CustomerID
                                    ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@CustomerID", request.CustomerID);
                        sqlCommand.Parameters.AddWithValue("@RoomType", request.RoomType);
                        sqlCommand.Parameters.AddWithValue("@RoomScenerio", request.RoomScenerio);
                        sqlCommand.Parameters.AddWithValue("@RoomPrice", request.RoomPrice);
                        sqlCommand.Parameters.AddWithValue("@CustomerName", request.CustomerName);
                        sqlCommand.Parameters.AddWithValue("@Contact", request.Contact);
                        sqlCommand.Parameters.AddWithValue("@EmailID", request.EmailID);
                        sqlCommand.Parameters.AddWithValue("@Address", request.Address);
                        sqlCommand.Parameters.AddWithValue("@Age", request.Age);
                        sqlCommand.Parameters.AddWithValue("@CheckInTime", request.CheckInTime);
                        sqlCommand.Parameters.AddWithValue("@CheckOutTime", request.CheckOutTime);
                        sqlCommand.Parameters.AddWithValue("@IDProof", request.IDProof);
                        sqlCommand.Parameters.AddWithValue("@IDNumber", request.IDNumber);
                        sqlCommand.Parameters.AddWithValue("@PinCode", request.PinCode);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In InsertCustomerDetail");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }


            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message : " + ex.Message;
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<DeleteCustomerDetailResponse> DeleteCustomerDetail(int CustomerID)
        {
            DeleteCustomerDetailResponse response = new DeleteCustomerDetailResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            int AvailableRoom = 0, AvailableAcRoom = 0, AvailableSingleBedAcRoom = 0, AvailableDoubleBedAcRoom = 0, AvailableNonAcRoom = 0, AvailableSingleBedNonAcRoom = 0, AvailableDoubleBedNonAcRoom = 0;
            string RoomType = string.Empty, RoomScenerio = string.Empty;
            try
            {
                _logger.LogInformation($"DeleteCustomerDetail In DataAccessLayer Calling .... request ID : {CustomerID}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT AvailableRoom, 
                                           AvailableAcRoom, 
                                           AvailableSingleBedAcRoom, 
                                           AvailableDoubleBedAcRoom,
                                           AvailableNonAcRoom, 
                                           AvailableSingleBedNonAcRoom, 
                                           AvailableDoubleBedNonAcRoom
                                    FROM fact_master_details";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {

                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dbDataReader.HasRows)
                            {
                                await dbDataReader.ReadAsync();
                                AvailableRoom = dbDataReader["AvailableRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableRoom"] : 0;
                                AvailableAcRoom = dbDataReader["AvailableAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableAcRoom"] : 0;
                                AvailableSingleBedAcRoom = dbDataReader["AvailableSingleBedAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableSingleBedAcRoom"] : 0;
                                AvailableDoubleBedAcRoom = dbDataReader["AvailableDoubleBedAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableDoubleBedAcRoom"] : 0;
                                AvailableNonAcRoom = dbDataReader["AvailableNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableNonAcRoom"] : 0;
                                AvailableSingleBedNonAcRoom = dbDataReader["AvailableSingleBedNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableSingleBedNonAcRoom"] : 0;
                                AvailableDoubleBedNonAcRoom = dbDataReader["AvailableDoubleBedNonAcRoom"] != DBNull.Value ? (Int32)dbDataReader["AvailableDoubleBedNonAcRoom"] : 0;
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message : " + ex.Message;
                    }
                    finally
                    {
                        await sqlCommand.DisposeAsync();
                    }
                }


                SqlQuery = @"       SELECT RoomType, 
                                           RoomScenerio
                                    FROM CustomerDetails
                                    WHERE CustomerID=@CustomerID";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {

                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@CustomerID", CustomerID);
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dbDataReader.HasRows)
                            {
                                await dbDataReader.ReadAsync();
                                RoomType = dbDataReader["RoomType"] != DBNull.Value ? (string)dbDataReader["RoomType"] : string.Empty;
                                RoomScenerio = dbDataReader["RoomScenerio"] != DBNull.Value ? (string)dbDataReader["RoomScenerio"] : string.Empty;
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message : " + ex.Message;
                    }
                    finally
                    {
                        await sqlCommand.DisposeAsync();
                    }
                }


                AvailableRoom += 1;
                if (RoomType.ToLowerInvariant().Equals("ac"))
                {
                    AvailableAcRoom += 1;
                    if (RoomScenerio.ToLowerInvariant().Equals("single bed"))
                    {
                        AvailableSingleBedAcRoom += 1;
                    }
                    else if (RoomScenerio.ToLowerInvariant().Equals("double bed"))
                    {
                        AvailableDoubleBedAcRoom += 1;
                    }
                }
                else if (RoomType.ToLowerInvariant().Equals("non ac"))
                {
                    AvailableNonAcRoom += 1;
                    if (RoomScenerio.ToLowerInvariant().Equals("single bed"))
                    {
                        AvailableSingleBedNonAcRoom += 1;
                    }
                    else if (RoomScenerio.ToLowerInvariant().Equals("double bed"))
                    {
                        AvailableDoubleBedNonAcRoom += 1;
                    }
                }




                SqlQuery = @"
                            
                            UPDATE fact_master_details
                            SET AvailableRoom = @AvailableRoom, 
                                AvailableAcRoom = @AvailableAcRoom, 
                                AvailableSingleBedAcRoom = @AvailableSingleBedAcRoom, 
                                AvailableDoubleBedAcRoom = @AvailableDoubleBedAcRoom,
                                AvailableNonAcRoom = @AvailableNonAcRoom, 
                                AvailableSingleBedNonAcRoom = @AvailableSingleBedNonAcRoom, 
                                AvailableDoubleBedNonAcRoom = @AvailableDoubleBedNonAcRoom
                            WHERE Role = 'master';
                            
                            DELETE FROM CustomerDetails WHERE CustomerID=@CustomerID;
                            ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        //
                        sqlCommand.Parameters.AddWithValue("@AvailableRoom", AvailableRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableAcRoom", AvailableAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedAcRoom", AvailableSingleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedAcRoom", AvailableDoubleBedAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableNonAcRoom", AvailableNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableSingleBedNonAcRoom", AvailableSingleBedNonAcRoom);
                        sqlCommand.Parameters.AddWithValue("@AvailableDoubleBedNonAcRoom", AvailableDoubleBedNonAcRoom);
                        //
                        sqlCommand.Parameters.AddWithValue("@CustomerID", CustomerID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In DeleteCustomerDetail");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<PayCustomerBillResponse> PayCustomerBill(PayCustomerBillRequest request)
        {
            PayCustomerBillResponse response = new PayCustomerBillResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"UPDATE CustomerDetails
                                    SET IsPaid=1
                                    WHERE CustomerID=@CustomerID
                                    ";

                using (MySqlCommand sqlCommand = new MySqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@CustomerID", request.CustomerID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In PayCustomerBill");
                        }

                    }
                    catch (Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }


            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message : " + ex.Message;
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }
    }
}
