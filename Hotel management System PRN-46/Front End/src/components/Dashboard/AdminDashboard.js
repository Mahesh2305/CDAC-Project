import React, { Component } from "react";
import "./AdminDashboard.css";
import ProjectAdminServices from "../../services/ProjectAdminServices";
import ProjectFeedbackServices from "../../services/ProjectFeedbackServices";
import ProjectUserServices from "../../services/ProjectUserServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InfoIcon from "@material-ui/icons/Info";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import BookIcon from "@material-ui/icons/Book";
import BookOutlinedIcon from "@material-ui/icons/BookOutlined";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Pagination from "@material-ui/lab/Pagination";
import FeedbackIcon from "@material-ui/icons/Feedback";
import FeedbackOutlinedIcon from "@material-ui/icons/FeedbackOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import SettingsIcon from "@material-ui/icons/Settings";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

//Table Library
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

const services = new ProjectAdminServices();
const userServices = new ProjectUserServices();
const feedbackServices = new ProjectFeedbackServices();

const MobileRegex = RegExp(/^[0-9]{11}$/i);
const PinCodeRegex = RegExp(/^[0-9]{7}$/i);
const EmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
      TotalRoom: 0,
      AcRoom: 0,
      NonAcRoom: 0,
      NoOfAcSingleBedRoom: 0,
      NoOfNonAcSingleBedRoom: 0,
      AcSingleBedRoomPrice: 0,
      NonAcSingleBedRoomPrice: 0,
      NoOfAcDoubleBedRoom: 0,
      NoOfNonAcDoubleBedRoom: 0,
      AcDoubleBedRoomPrice: 0,
      NonAcDoubleBedRoomPrice: 0,
      //
      AvailableRoom: 0,
      AvailableAcRoom: 0,
      AvailableSingleBedAcRoom: 0,
      AvailableDoubleBedAcRoom: 0,
      AvailableNonAcRoom: 0,
      AvailableSingleBedNonAcRoom: 0,
      AvailableDoubleBedNonAcRoom: 0,
      //
      TotalRoomFlag: false,
      AcRoomFlag: false,
      NonAcRoomFlag: false,
      NoOfAcSingleBedRoomFlag: false,
      NoOfNonAcSingleBedRoomFlag: false,
      NoOfAcDoubleBedRoomFlag: false,
      NoOfNonAcDoubleBedRoomFlag: false,
      //List
      BookingList: [],
      Feedback: [],
      //
      CustomerID: 0,
      InsertionDate: "",
      RoomType: "",
      RoomScenerio: "",
      RoomPrice: 0,
      TotalRoomPrice: 0,
      CustomerName: "",
      Contact: "",
      EmailID: "",
      Address: "",
      Age: "",
      CheckInTime: "",
      CheckOutTime: "",
      IdProof: "",
      IDProofList: ["Adhar Card", "Driving Licence", "Voting Card"],
      IdNumber: "",
      PinCode: "",
      IsPaid: false,
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      PageNumber: 1,
      JobPageNumber: 1,
      BookingPageNumber: 1,
      FeedbackPageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      OpenEdit: false, // Open Editing Booking Model
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,

      OpenShow: true,
      OpenApplication: false,
      OpenTrash: false,
      OpenFeedBack: false,
      Update: false,
      ShowApplicantInfo: false,
      OpenBookModel: false, //Editing Booking Application
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    this.GetMasterData();
    // this.GetJobs(this.state.JobPageNumber)
  }

  GetMasterData() {
    this.setState({ OpenLoader: true });
    services
      .GetMasterData()
      .then((data) => {
        console.log("GetMasterData data : ", data);
        this.setState({
          TotalRoom: Number(data.data.data.totalRoom),

          AcRoom: Number(data.data.data.totalAcRoom),

          NonAcRoom: Number(data.data.data.totalNonAcRoom),

          NoOfAcSingleBedRoom: Number(data.data.data.totalSingleBedAcRoom),
          NoOfNonAcSingleBedRoom: Number(
            data.data.data.totalSingleBedNonAcRoom
          ),
          AcSingleBedRoomPrice: Number(data.data.data.singleBedAcRoomPrice),
          NonAcSingleBedRoomPrice: Number(
            data.data.data.singleBedNonAcRoomPrice
          ),

          NoOfAcDoubleBedRoom: Number(data.data.data.totalDoubleBedAcRoom),
          NoOfNonAcDoubleBedRoom: Number(
            data.data.data.totalDoubleBedNonAcRoom
          ),
          AcDoubleBedRoomPrice: Number(data.data.data.doubleBedAcRoomPrice),
          NonAcDoubleBedRoomPrice: Number(
            data.data.data.doubleBedNonAcRoomPrice
          ),
          //
          AvailableRoom: Number(data.data.data.availableRoom),
          AvailableAcRoom: Number(data.data.data.availableAcRoom),
          AvailableSingleBedAcRoom: Number(
            data.data.data.availableSingleBedAcRoom
          ),
          AvailableDoubleBedAcRoom: Number(
            data.data.data.availableDoubleBedAcRoom
          ),
          AvailableNonAcRoom: Number(data.data.data.availableNonAcRoom),
          AvailableSingleBedNonAcRoom: Number(
            data.data.data.availableSingleBedNonAcRoom
          ),
          AvailableDoubleBedNonAcRoom: Number(
            data.data.data.availableDoubleBedNonAcRoom
          ),
          OpenLoader: false,
        });
      })
      .catch((error) => {
        console.log("GetMasterData Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  }

  GetJobs = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };
  };

  GetBookingList(CurrentPage) {
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };
    // debugger;
    this.setState({ OpenLoader: true });
    services
      .GetCustomerDetail(data)
      .then((data) => {
        console.log("GetCustomerDetail Data : ", data);
        this.setState({
          BookingList: data.data.data,
          OpenLoader: false,
          OpenSnackBar: true,
          Message: data.data.message,
        });
      })
      .catch((error) => {
        console.log("GetCustomerDetail Error : ", error);
        this.setState({
          OpenLoader: false,
          OpenSnackBar: true,
          Message: "Something Went Wrong",
        });
      });
  }

  GetFeedBack = async (CurrentPage) => {
    // debugger;
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 5,
    };

    await feedbackServices
      .GetFeedbacks(data)
      .then((data) => {
        console.log("Feedback Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Open: false,
          Message: data.data.message,
          Feedback: data.data.data,
        });
      })
      .catch((error) => {
        console.log("Feedback Error : ", error);
        this.setState({
          OpenSnackBar: true,

          Open: false,
          Message: "Something Went Wrong.",
        });
      });
  };

  handleSubmit = (e) => {
    console.log("Handle Submit Calling ... ");
    let state = this.state;

    if (state.ContactFlag || state.EmailIDFlag) {
      return;
    }

    this.CheckValidity();
    if (
      state.TotalRoomFlag === false &&
      state.AcRoomFlag === false &&
      state.NonAcRoomFlag === false &&
      state.NoOfAcSingleBedRoomFlag === false &&
      state.NoOfNonAcSingleBedRoomFlag === false &&
      state.NoOfAcDoubleBedRoomFlag === false &&
      state.NoOfNonAcDoubleBedRoomFlag === false
    ) {
      console.log("Acceptable");
      this.setState({ OpenLoader: true });
      let data = {
        // TotalRoom, AvailableRoom
        totalRoom: Number(state.TotalRoom),
        //TotalAcRoom, AvailableAcRoom
        totalAcRoom: Number(state.AcRoom),
        //TotalSingleBedAcRoom, AvailableSingleBedAcRoom, SingleBedAcRoomPrice
        totalSingleBedAcRoom: Number(state.NoOfAcSingleBedRoom),
        singleBedAcRoomPrice: Number(state.AcSingleBedRoomPrice),
        //TotalDoubleBedAcRoom, AvailableDoubleBedAcRoom, DoubleBedAcRoomPrice
        totalDoubleBedAcRoom: Number(state.NoOfAcDoubleBedRoom),
        doubleBedAcRoomPrice: Number(state.AcDoubleBedRoomPrice),
        //TotalNonAcRoom, AvailableNonAcRoom
        totalNonAcRoom: Number(state.NonAcRoom),
        //TotalSingleBedNonAcRoom, AvailableSingleBedNonAcRoom, SingleBedNonAcRoomPrice
        totalSingleBedNonAcRoom: Number(state.NoOfNonAcSingleBedRoom),
        singleBedNonAcRoomPrice: Number(state.NonAcSingleBedRoomPrice),
        //DoubleBedNonAcRoom, AvailableTotalNonAcRoom, DoubleBedNonAcRoomPrice
        totalDoubleBedNonAcRoom: Number(state.NoOfNonAcDoubleBedRoom),
        doubleBedNonAcRoomPrice: Number(state.NonAcDoubleBedRoomPrice),
      };

      services
        .InsertMasterData(data)
        .then((data) => {
          console.log("InsertMasterData data : ", data);
          this.setState({
            OpenSnackBar: true,
            Message: data.data.message,
            OpenLoader: false,
            open: false,
          });
          this.GetMasterData();
        })
        .catch((error) => {
          console.log("InsertMasterData Error : ", error);
          this.setState({
            OpenLoader: false,
            OpenSnackBar: true,
            Message: "Please Fill Required Field",
          });
          this.GetMasterData();
        });
    } else {
      console.log("Please Fill Required Field");
      this.setState({
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
        OpenLoader: false,
      });
    }
  };

  handleUpdate = () => {
    let State = this.state;

    if (State.ContactFlag || State.EmailIDFlag) {
      return;
    }

    if (
      State.CustomerName !== "" &&
      (Number(State.TotalRoomPrice) === 0 || State.TotalRoomPrice === "")
    ) {
      console.log("Invalid Timing...");
      this.setState({
        CheckInTimeFlag: true,
        CheckOutTimeFlag: true,
        OpenSnackBar: true,
        Message: "Please Fill Check In Time & Check Out Time.",
      });
      return;
    }

    this.CheckValidity1();

    if (
      State.CustomerName !== "" &&
      State.Contact !== "" &&
      State.EmailID !== "" &&
      State.Address !== "" &&
      State.Age !== "" &&
      State.CheckInTime !== "" &&
      State.CheckOutTime !== "" &&
      State.IDProof !== "" &&
      State.IDNumber !== ""
    ) {
      let data = {
        customerID: Number(State.CustomerID),
        roomType: State.RoomType,
        roomScenerio: State.RoomScenerio,
        roomPrice: Number(State.TotalRoomPrice),
        customerName: State.CustomerName,
        contact: State.Contact,
        emailID: State.EmailID,
        address: State.Address,
        age: State.Age.toString(),
        checkInTime: State.CheckInTime,
        checkOutTime: State.CheckOutTime,
        idProof: State.IDProof,
        idNumber: State.IDNumber,
        pinCode: State.Pincode,
      };

      userServices
        .UpdateCustomerDetail(data)
        .then((data) => {
          this.setState({
            OpenSnackBar: true,
            OpenEdit: false,
            OpenBookModel: false,
            open: false,
            Message: data.data.message,
          });
          this.GetBookingList(this.state.BookingPageNumber);
          this.handleClose();
        })
        .catch((error) => {
          this.setState({
            OpenSnackBar: true,
            OpenEdit: false,
            OpenBookModel: false,
            Message: "Something Went Wrong",
          });
          this.GetBookingList(this.state.BookingPageNumber);
          this.handleClose();
        });
    } else {
      console.log("Please Fill Required Field");
      this.setState({
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
      });
    }
  };

  handleDeleteProjectPermanently = (ProjectID) => {
    console.log("Handle Delete Project Permanently Calling ... ");
    let data = {
      projectID: ProjectID,
    };
  };

  handleDeleteApplication = (ID) => {
    console.log("Handle Reject Application Calling .... ID : ", ID);
    this.setState({
      RejectApplication: true,
      ApplicationID: ID,
    });
  };

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpen = () => {
    console.log("Handle Open Calling ... ");

    this.setState({
      open: true,
      OpenShow: true,
      OpenTrash: false,
      JobPageNumber: 1,
      JobID: 0,
      JobName: "",
      JobDescription: "",
      JobStream: "",
      JobField: "",
      JobSalary: "",
      JobDocumentUrl: "",
      IsActive: false,
      TotalPages: !this.state.OpenInsert ? 0 : this.state.TotalPages,
    });
  };

  handleOpenPayModel = (CustomerID) => {
    console.log("handleOpenPayModel Calling ... Customer ID : ", CustomerID);
    if (CustomerID !== undefined && CustomerID !== 0) {
      this.setState({ CustomerID: CustomerID, OpenEdit: true });
    } else {
      this.setState({ OpenSnackBar: true, Message: "Something Went Wrong" });
    }
  };

  handlePayCustomerBill = (CustomerID) => {
    if (CustomerID !== undefined) {
      let data = {
        customerID: CustomerID,
      };
      userServices
        .PayCustomerBill(data)
        .then((data) => {
          console.log("handlePayCustomerBill Data : ", data);
          this.setState({ OpenEdit: false });
          this.GetBookingList(this.state.BookingPageNumber);
        })
        .catch((error) => {
          console.log("handlePayCustomerBill Error : ", error);
          this.setState({ OpenEdit: false });
          this.GetBookingList(this.state.BookingPageNumber);
        });
    } else {
      console.log("Invalid Customer ID");
    }
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      open: false,
      Update: false,
      OpenEdit: false,
      OpenBookModel: false,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleOpenList = (e) => {
    console.log("Handle Open List Calling ... ");

    this.setState({
      OpenShow: true,
      OpenApplication: false,
      OpenFeedBack: false,
      BookingPageNumber: 1,
      FeedbackPageNumber: 1,
    });

    this.GetMasterData();
  };

  handleOpenBookingList = async () => {
    console.log("handleOpenBookingList Calling...");
    this.GetBookingList(this.state.BookingPageNumber);
    this.setState({
      OpenShow: false,
      OpenApplication: true,
      OpenFeedBack: false,
      FeedbackPageNumber: 1,
      JobPageNumber: 1,
    });
  };

  handleFeedBackOpen = (e) => {
    console.log("Handle FeedBack Open Calling...");
    this.GetFeedBack(this.state.FeedbackPageNumber);
    this.setState({
      OpenShow: false,
      OpenApplication: false,
      JobPageNumber: 1,
      BookingPageNumber: 1,
      OpenFeedBack: true,
    });
  };

  CheckValidity = () => {
    console.log("Check Validity Calling...");
    this.setState({
      TotalRoomFlag: false,
      AcRoomFlag: false,
      NonAcRoomFlag: false,
      NoOfAcSingleBedRoomFlag: false,
      NoOfNonAcSingleBedRoomFlag: false,
      NoOfAcDoubleBedRoomFlag: false,
      NoOfNonAcDoubleBedRoomFlag: false,
    });
    if (this.state.TotalRoom === 0 || this.state.TotalRoom === "") {
      this.setState({ TotalRoomFlag: true });
    }
    if (this.state.AcRoom === 0 || this.state.AcRoom === "") {
      this.setState({ AcRoomFlag: true });
    }
    if (this.state.NonAcRoom === "" || this.state.NonAcRoom === 0) {
      this.setState({ NonAcRoomFlag: true });
    }

    if (
      this.state.NoOfAcSingleBedRoom === 0 ||
      this.state.NoOfAcSingleBedRoom === ""
    ) {
      this.setState({ NoOfAcSingleBedRoomFlag: true });
    }
    if (
      this.state.NoOfNonAcSingleBedRoom === 0 ||
      this.state.NoOfNonAcSingleBedRoom === ""
    ) {
      this.setState({ NoOfNonAcSingleBedRoomFlag: true });
    }
    if (
      this.state.NoOfAcDoubleBedRoom === "" ||
      this.state.NoOfAcDoubleBedRoom === 0
    ) {
      this.setState({ NoOfAcDoubleBedRoomFlag: true });
    }

    if (
      this.state.NoOfNonAcDoubleBedRoom === "" ||
      this.state.NoOfNonAcDoubleBedRoom === 0
    ) {
      this.setState({ NoOfNonAcDoubleBedRoomFlag: true });
    }
  };

  CheckValidity1() {
    console.log("Check Validity Calling...");
    this.setState({
      CustomerNameFlag: false,
      ContactFlag: false,
      EmailIDFlag: false,
      AddressFlag: false,
      AgeFlag: false,
      CheckInTimeFlag: false,
      CheckOutTimeFlag: false,
      IDProofFlag: false,
      IDNumberFlag: false,
    });

    if (this.state.CustomerName === "") {
      this.setState({ CustomerNameFlag: true });
    }
    if (this.state.Contact === "") {
      this.setState({ ContactFlag: true });
    }
    if (this.state.EmailID === "") {
      this.setState({ EmailIDFlag: true });
    }
    if (this.state.Address === "") {
      this.setState({ AddressFlag: true });
    }
    if (this.state.Age === "" || Number(this.state.Age) === 0) {
      this.setState({ AgeFlag: true });
    }
    if (this.state.CheckInTime === "") {
      this.setState({ CheckInTimeFlag: true });
    }
    if (this.state.CheckOutTime === "") {
      this.setState({ CheckOutTimeFlag: true });
    }
    if (this.state.IDProof === "") {
      this.setState({ IDProofFlag: true });
    }
    if (this.state.IDNumber === "") {
      this.setState({ IDNumberFlag: true });
    }
  }

  handleRadioChange = (event) => {
    console.log("Handle Redio Change Calling...");
    this.setState({ ProjectStatus: event.target.value });
  };

  handleChanges = (e) => {
    let state = this.state;

    const { name, value } = e.target;
    console.log("name : ", name, "Value : ", value);
    if (name === "AcRoom") {
      if (Number(state.TotalRoom) >= value) {
        this.setState({
          AcRoom: value,
          NonAcRoom: state.TotalRoom - value,
          NoOfAcSingleBedRoom: 0,
          NoOfAcDoubleBedRoom: 0,
          NoOfNonAcSingleBedRoom: 0,
          NoOfNonAcDoubleBedRoom: 0,
        });
      }
    } else if (name === "NonAcRoom") {
      if (Number(state.TotalRoom) >= value) {
        this.setState({
          NonAcRoom: value,
          AcRoom: state.TotalRoom - value,
          NoOfAcSingleBedRoom: 0,
          NoOfAcDoubleBedRoom: 0,
          NoOfNonAcSingleBedRoom: 0,
          NoOfNonAcDoubleBedRoom: 0,
        });
      }
    } else if (name === "NoOfAcSingleBedRoom") {
      if (Number(state.AcRoom) > 0 && Number(state.AcRoom) >= value) {
        this.setState({
          NoOfAcSingleBedRoom: value,
          NoOfAcDoubleBedRoom: state.AcRoom - value,
        });
      }
    } else if (name === "NoOfAcDoubleBedRoom") {
      if (Number(state.AcRoom) > 0 && Number(state.AcRoom) >= value) {
        this.setState({
          NoOfAcDoubleBedRoom: value,
          NoOfAcSingleBedRoom: state.AcRoom - value,
        });
      }
    } else if (name === "NoOfNonAcSingleBedRoom") {
      if (Number(state.NonAcRoom) > 0 && Number(state.NonAcRoom) >= value) {
        this.setState({
          NoOfNonAcSingleBedRoom: value,
          NoOfNonAcDoubleBedRoom: state.NonAcRoom - value,
        });
      }
    } else if (name === "NoOfNonAcDoubleBedRoom") {
      if (Number(state.NonAcRoom) > 0 && Number(state.NonAcRoom) >= value) {
        this.setState({
          NoOfNonAcDoubleBedRoom: value,
          NoOfNonAcSingleBedRoom: state.NonAcRoom - value,
        });
      }
    } else if (name === "TotalRoom") {
      this.setState({ [name]: value, AcRoom: 0, NonAcRoom: 0 });
    } else {
      this.setState({ [name]: value });
    }
  };

  handleChangeContact = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", MobileRegex.test(value));
    if (!MobileRegex.test(value)) {
      this.setState({ ContactFlag: true });
    } else {
      this.setState({ ContactFlag: false });
    }
    //

    if (value.toString().length <= 10) {
      this.setState(
        { [name]: value },
        console.log("Name : ", name, "Value : ", value)
      );
      if (value.toString().length === 10) {
        this.setState({ ContactFlag: false });
      }
    }
  };

  handleChangeEmail = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", EmailRegex.test(value));
    if (!EmailRegex.test(value)) {
      this.setState({ EmailIDFlag: true });
    } else {
      this.setState({ EmailIDFlag: false });
    }
    this.setState(
      { [name]: value },
      console.log("Name : ", name, "Value : ", value)
    );
  };

  handleChangePinCode = (e) => {
    const { name, value } = e.target;
    console.log("Regex Match : ", PinCodeRegex.test(value));
    if (!PinCodeRegex.test(value)) {
      this.setState(
        { [name]: value },
        console.log("Name : ", name, "Value : ", value)
      );
    }
  };

  handleTimeChanges = (e) => {
    const { name, value } = e.target;

    this.setState(
      { [name]: value },
      console.log("Name : ", name, " value : ", value)
    );

    if (this.state.CheckInTime !== "" && name === "CheckOutTime") {
      const date1 = new Date(this.state.CheckInTime);
      const date2 = new Date(value);
      let Difference = date2.getTime() - date1.getTime();
      let NumberOfDays = Difference / (1000 * 3600 * 24);
      console.log("# Of Days : ", NumberOfDays);
      if (NumberOfDays > 0) {
        this.setState({ TotalRoomPrice: NumberOfDays * this.state.RoomPrice });
      } else {
        this.setState({ TotalRoomPrice: 0 });
      }
    } else if (this.state.CheckOutTime !== "" && name === "CheckInTime") {
      const date2 = new Date(this.state.CheckOutTime);
      const date1 = new Date(value);
      let Difference = date2.getTime() - date1.getTime();
      let NumberOfDays = Difference / (1000 * 3600 * 24);
      console.log("# Of Days : ", NumberOfDays);
      if (NumberOfDays > 0) {
        this.setState({ TotalRoomPrice: NumberOfDays * this.state.RoomPrice });
      } else {
        this.setState({ TotalRoomPrice: 0 });
      }
    }
  };

  handleEditMyBooking = (data) => {
    console.log("handleEditMyBooking Data : ", data);

    if (data.roomType === "Ac") {
      if (data.roomScenerio === "Single Bed") {
        this.setState({ RoomPrice: this.state.AcSingleBedRoomPrice });
      } else {
        this.setState({ RoomPrice: this.state.AcDoubleBedRoomPrice });
      }
    } else {
      if (data.roomScenerio === "Single Bed") {
        this.setState({ RoomPrice: this.state.NonAcSingleBedRoomPrice });
      } else {
        this.setState({ RoomPrice: this.state.NonAcDoubleBedRoomPrice });
      }
    }

    this.setState({
      OpenEdit: true,
      Update: true,
      OpenBookModel: true,
      CustomerID: data.customerID,
      RoomType: data.roomType,
      RoomScenerio: data.roomScenerio,
      // RoomPrice: Number(data.roomPrice),
      TotalRoomPrice: Number(data.roomPrice),
      CustomerName: data.customerName,
      Contact: data.contact,
      EmailID: data.emailID,
      Address: data.address,
      Age: Number(data.age),
      CheckInTime: data.checkInTime,
      CheckOutTime: data.checkOutTime,
      IDProof: data.idProof,
      IDNumber: data.idNumber,
      Pincode: data.pinCode,
    });
  };

  handleDeleteBookingApplication = async (ID) => {
    console.log("handleDeleteBookingApplication Calling ..... ID :", ID);
    userServices
      .DeleteCustomerDetail(ID)
      .then((data) => {
        console.log("handleDeleteBookingApplication Data : ", data);
        this.GetBookingList(this.state.BookingPageNumber);
      })
      .catch((error) => {
        console.log("handleDeleteBookingApplication Error : ", error);
        this.GetBookingList(this.state.BookingPageNumber);
      });
  };

  handleDeleteFeedback = async (ID) => {
    console.log("handleDeleteFeedback Calling ..... ID :", ID);
    // let data = { ID: ID };
    await feedbackServices
      .DeleteFeedback(ID)
      .then((data) => {
        console.log("Feedback Data : ", data);
        this.setState({
          OpenSnackBar: true,
          Open: false,
          Message: data.data.message,
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      })
      .catch((error) => {
        console.log("Feedback Error : ", error);
        this.setState({
          OpenSnackBar: true,

          Open: false,
          Message: "Something Went Wrong.",
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      });
  };

  handleShowApplicantInfo = (data) => {
    console.log("handleShowApplicantInfo Calling ...");
    this.setState({
      ShowApplicantInfo: true,
      Update: false,
      open: true,
      ApplicationID: data.applicationID,
      JobID: data.jobID,
      JobName: data.jobTitle,
      Name: data.applicantName,
      Contact: data.contact,
      EmailID: data.emailID,
      Address: data.address,
      WorkExperience: data.workExperience,
      DateOfBirth: data.dateOfBirth,
      PassingYear: data.passingYear,
      CollegeName: data.collegeName,
      Degree: data.degree,
      CurrentStatus: data.currentStatus,
      Skill: data.skill,
      Age: data.age,
      Gender: data.gender,
      Pincode: data.pinCode,
    });
  };

  handleActiveChange = (e) => {
    console.log(" Checked Status : ", e.target.checked);
    this.setState({ IsActive: e.target.checked });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);

    if (this.state.OpenShow) {
      this.setState({
        JobPageNumber: value,
        BookingPageNumber: 1,
        FeedbackPageNumber: 1,
      });
      // await this.GetJobs(value)
    } else if (this.state.OpenApplication) {
      this.setState({
        BookingPageNumber: value,
        JobPageNumber: 1,
        FeedbackPageNumber: 1,
      });
      // await this.GetBookingList(value)
    } else if (this.state.OpenFeedBack) {
      this.setState({
        FeedbackPageNumber: value,
        JobPageNumber: 1,
        BookingPageNumber: 1,
      });
      // await this.GetFeedBack(value)
    }
  };

  // handleField = (event) => {
  //   console.log("Selected Job Field : ", event.target.value);
  //   this.setState({ JobField: event.target.value });
  // };

  // handleJobStream = (event) => {
  //   console.log("Selected Stream : ", event.target.value);
  //   this.setState({ JobStream: event.target.value });
  // };

  // SelectField = () => {
  //   return this.state.Fields.map((data, index) => {
  //     //console.log(dt);
  //     return (
  //       <MenuItem value={data.fieldName} key={index} name={data.fieldName}>
  //         {data.fieldName}
  //       </MenuItem>
  //     );
  //   });
  // };

  GetFeedbackList = (e) => {
    let self = this;
    return Array.isArray(this.state.Feedback) && this.state.Feedback.length > 0
      ? this.state.Feedback.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
              }}
            >
              <div className="Row" style={{ flex: 1 }}>
                {data.feedbackID}
              </div>
              <div className="Row" style={{ flex: 8 }}>
                {data.feedBack}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={() => {
                    self.handleDeleteFeedback(data.feedbackID);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  SignOut = async () => {
    await localStorage.removeItem("manager_token");
    this.props.history.push("/SignIn");
  };

  handleSetting = () => {
    this.setState({ open: true });
  };

  OpenCurrentInfo = () => {
    let state = this.state;
    return (
      <div className="Sub-OpenCurrentInfo">
        <div className="Title">
          <span className="Dot"></span>
          Real Time DashBoard
        </div>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "black" }}
                >
                  Total Rooms
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "black" }}
                >
                  Total AC Room
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "black" }}
                >
                  Total No AC Room
                </Typography>
              </CardContent>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "blue" }}
                >
                  {state.TotalRoom}
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "blue" }}
                >
                  {state.AcRoom}
                </Typography>
                <Typography
                  variant="h4"
                  component="h2"
                  style={{ flex: 4, color: "blue" }}
                >
                  {state.NonAcRoom}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  // variant="h6"
                  component="h2"
                  spacing={2}
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available AC Room
                </Typography>
                <Typography
                  // variant="h6"
                  component="h2"
                  spacing={2}
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available Single Bed Room
                </Typography>
                <Typography
                  // variant="h6"
                  spacing={2}
                  component="h2"
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available Double Bed Room
                </Typography>
              </CardContent>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableAcRoom}
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableSingleBedAcRoom}
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableDoubleBedAcRoom}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available Non AC Room
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available Single Bed Room
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "black",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  Available Double Bed Room
                </Typography>
              </CardContent>
              <CardContent style={{ display: "flex" }}>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableNonAcRoom}
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableSingleBedNonAcRoom}
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  style={{
                    flex: 4,
                    color: "blue",
                    fontSize: 25,
                    fontWeight: 500,
                  }}
                >
                  {state.AvailableDoubleBedNonAcRoom}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  };

  OpenBookingList = () => {
    let state = this.state;
    return (
      <TableContainer component={Paper} style={{ height: "fit-Content" }}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow
              style={{
                display: "flex",
                minHeight: "50px",
              }}
            >
              <div className="Header" style={{ flex: 1 }}>
                Cust.ID
              </div>
              <div className="Header" style={{ flex: 0.5 }}>
                Type
              </div>
              <div className="Header" style={{ flex: 1 }}>
                Scenario
              </div>
              <div className="Header" style={{ flex: 1 }}>
                Price
              </div>
              <div className="Header" style={{ flex: 2 }}>
                Cust. Name
              </div>
              <div className="Header" style={{ flex: 1 }}>
                Contact
              </div>
              <div className="Header" style={{ flex: 2 }}>
                CheckInTime
              </div>
              <div className="Header" style={{ flex: 2 }}>
                CheckOutTime
              </div>
              <div className="Header" style={{ flex: 1 }}>
                Status
              </div>
              <div className="Header" style={{ flex: 2 }}></div>
            </TableRow>
          </TableHead>
          <TableBody style={{ height: "fit-content" }}>
            {this.handleBookingList()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  handleBookingList = (e) => {
    let self = this;
    return Array.isArray(this.state.BookingList) &&
      this.state.BookingList.length > 0
      ? this.state.BookingList.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
              }}
            >
              <div className="Row" style={{ flex: 1 }}>
                {data.customerID}
              </div>
              <div className="Row" style={{ flex: 0.5 }}>
                {data.roomType}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                {data.roomScenerio}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                {data.roomPrice}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.customerName}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                {data.contact}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.checkInTime}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {data.checkOutTime}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                {data.isPaid ? <>Paid</> : <>Not Paid</>}
              </div>
              <div className="Row" style={{ flex: 2 }}>
                {!data.isPaid ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      self.handleOpenPayModel(data.customerID);
                    }}
                  >
                    Paid
                  </Button>
                ) : null}
                <IconButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    self.handleEditMyBooking(data);
                  }}
                >
                  <EditIcon size="medium" />
                </IconButton>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={() => {
                    self.handleDeleteBookingApplication(data.customerID);
                  }}
                >
                  <DeleteIcon size="medium" />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  OpenFeedBackList = () => {
    return (
      <TableContainer component={Paper} style={{ height: "fit-Content" }}>
        <Table>
          <TableHead>
            <TableRow
              style={{
                display: "flex",
                minHeight: "50px",
              }}
            >
              <div className="Header" style={{ flex: 1 }}>
                Feedback No
              </div>
              <div className="Header" style={{ flex: 8 }}>
                Feedback
              </div>
              <div className="Header" style={{ flex: 1 }}></div>
            </TableRow>
          </TableHead>
          <TableBody style={{ height: "fit-content" }}>
            {this.GetFeedbackList()}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    return (
      <div className="AdminDashboard-Container">
        <div className="Sub-Container">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "#202020" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  className=""
                  color="inherit"
                  onClick={this.handleMenuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  Hotel Manager DashBoard
                </Typography>

                <IconButton onClick={this.handleSetting}>
                  <SettingsIcon style={{ color: "white" }} />
                </IconButton>
                <Button
                  color="inherit"
                  onClick={() => {
                    this.SignOut();
                  }}
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className={state.MenuOpen ? "SubBody11" : "SubBody12"}>
                <div
                  className={state.OpenShow ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenList}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    {state.OpenShow ? (
                      <InfoIcon style={{ color: "white" }} />
                    ) : (
                      <InfoOutlinedIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">DashBoard</div>
                  ) : null}
                </div>

                <div
                  className={
                    state.OpenApplication ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleOpenBookingList}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    {state.OpenApplication ? (
                      <BookIcon style={{ color: "white" }} />
                    ) : (
                      <BookOutlinedIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Records</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenFeedBack ? "NavButton1" : "NavButton2"}
                  onClick={this.handleFeedBackOpen}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    {state.OpenFeedBack ? (
                      <FeedbackIcon style={{ color: "white" }} />
                    ) : (
                      <FeedbackOutlinedIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">FeedBack</div>
                  ) : null}
                </div>
              </div>
              <div className={state.MenuOpen ? "SubBody21" : "SubBody22"}>
                <div style={{ height: "90%", width: "90%" }}>
                  {state.OpenShow
                    ? this.OpenCurrentInfo()
                    : state.OpenApplication
                    ? this.OpenBookingList()
                    : state.OpenFeedBack
                    ? this.OpenFeedBackList()
                    : null}
                </div>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.open}>
                    <div
                      style={{
                        backgroundColor: "white",
                        boxShadow: "5",
                        padding: "2px 4px 3px",
                        width: "1200px",
                        height: "600px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <>
                        <div className="Note">
                          Alert &nbsp;
                          <ErrorIcon style={{ color: "red" }} /> &nbsp;: This
                          Setting Reset Your All WebSite Data
                        </div>
                        <div className="Setting">
                          <div className="AcRoom-Setting">
                            <div className="Title">Ac Room</div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Total Room</div>
                              <TextField
                                autoComplete="off"
                                error={state.TotalRoomFlag}
                                className="Text-Input"
                                label="Total Room"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="TotalRoom"
                                value={state.TotalRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Ac Room</div>
                              <TextField
                                error={state.AcRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="Ac Room"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="AcRoom"
                                value={state.AcRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Single Bed Room</div>
                              <TextField
                                error={state.NoOfAcSingleBedRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="No. Of Sigle Bed Room"
                                variant="outlined"
                                size="small"
                                name="NoOfAcSingleBedRoom"
                                value={state.NoOfAcSingleBedRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">
                                Single Bed Room Price / Day
                              </div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Price"
                                variant="outlined"
                                size="small"
                                name="AcSingleBedRoomPrice"
                                value={state.AcSingleBedRoomPrice}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Double Bed Room</div>
                              <TextField
                                error={state.NoOfAcDoubleBedRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="No. Of Room"
                                variant="outlined"
                                size="small"
                                name="NoOfAcDoubleBedRoom"
                                value={state.NoOfAcDoubleBedRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">
                                Double Bed Room Price / Day
                              </div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Price"
                                variant="outlined"
                                size="small"
                                name="AcDoubleBedRoomPrice"
                                value={state.AcDoubleBedRoomPrice}
                                onChange={this.handleChanges}
                              />
                            </div>
                          </div>
                          <div className="NonAcRoom-Setting">
                            <div className="Title">Non Ac Room</div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Total Room</div>
                              <TextField
                                autoComplete="off"
                                error={state.TotalRoomFlag}
                                className="Text-Input"
                                label="Total Room"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="TotalRoom"
                                value={state.TotalRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Non Ac Room</div>
                              <TextField
                                error={state.NonAcRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="Non Ac Room"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="NonAcRoom"
                                value={state.NonAcRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Single Bed Room</div>
                              <TextField
                                error={state.NoOfNonAcSingleBedRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="No. Of Sigle Bed Room"
                                variant="outlined"
                                size="small"
                                name="NoOfNonAcSingleBedRoom"
                                value={state.NoOfNonAcSingleBedRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">
                                Single Bed Room Price / Day
                              </div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Price"
                                variant="outlined"
                                size="small"
                                name="NonAcSingleBedRoomPrice"
                                value={state.NonAcSingleBedRoomPrice}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">No. Of Double Bed Room</div>
                              <TextField
                                error={state.NoOfNonAcDoubleBedRoomFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="No. Of Room"
                                variant="outlined"
                                size="small"
                                name="NoOfNonAcDoubleBedRoom"
                                value={state.NoOfNonAcDoubleBedRoom}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">
                                Double Bed Room Price / Day
                              </div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Price"
                                variant="outlined"
                                size="small"
                                name="NonAcDoubleBedRoomPrice"
                                value={state.NonAcDoubleBedRoomPrice}
                                onChange={this.handleChanges}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="Button">
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 0 0 0" }}
                            onClick={
                              state.Update
                                ? this.handleUpdate
                                : this.handleSubmit
                            }
                          >
                            {state.Update ? <>Update</> : <>Apply Changes</>}
                          </Button>
                          <Button
                            variant="contained"
                            component="span"
                            style={{
                              margin: "10px 0 0 20px",
                              backgroundColor: "black",
                              color: "white",
                            }}
                            onClick={this.handleClose}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    </div>
                  </Fade>
                </Modal>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.OpenEdit}
                  // open={true}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.OpenEdit}>
                    {state.OpenBookModel ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1000px",
                          height: "600px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div className="Input-Field1">
                          <div className="Text">Room Type :</div>
                          <div className="Text-Input">{state.RoomType}</div>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Room Scenerio :</div>
                          <div className="Text-Input">{state.RoomScenerio}</div>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Room Price :</div>
                          <div className="Text-Input">
                            {state.TotalRoomPrice} Rs.
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              padding: "10px",
                            }}
                          >
                            <div className="Input-Field">
                              <div className="Text">Customer Name</div>
                              <TextField
                                autoComplete="off"
                                error={state.CustomerNameFlag}
                                className="Text-Input"
                                label="Name"
                                variant="outlined"
                                size="small"
                                name="CustomerName"
                                value={state.CustomerName}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Contact</div>
                              <TextField
                                autoComplete="off"
                                error={state.ContactFlag}
                                className="Text-Input"
                                label="Contact"
                                variant="outlined"
                                size="small"
                                name="Contact"
                                value={state.Contact}
                                onChange={this.handleChangeContact}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">EmailID</div>
                              <TextField
                                autoComplete="off"
                                error={state.EmailIDFlag}
                                className="Text-Input"
                                label="EmailID"
                                variant="outlined"
                                size="small"
                                name="EmailID"
                                value={state.EmailID}
                                onChange={this.handleChangeEmail}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Address</div>
                              <TextField
                                autoComplete="off"
                                error={state.AddressFlag}
                                className="Text-Input"
                                label="Address"
                                variant="outlined"
                                size="small"
                                name="Address"
                                value={state.Address}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Age</div>
                              <TextField
                                error={state.AgeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                label="Age"
                                placeholder="Ex. 24"
                                variant="outlined"
                                size="small"
                                name="Age"
                                value={state.Age}
                                onChange={this.handleChanges}
                              />
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              padding: "10px",
                            }}
                          >
                            <div className="Input-Field">
                              <div className="Text">Check In Time</div>
                              <TextField
                                error={state.CheckInTimeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                placeholder="dd/MM/yyyy HH:mm tt"
                                variant="outlined"
                                size="small"
                                name="CheckInTime"
                                type="datetime-local"
                                value={state.CheckInTime}
                                onChange={this.handleTimeChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Check Out Time</div>
                              <TextField
                                error={state.CheckOutTimeFlag}
                                autoComplete="off"
                                className="Text-Input"
                                // label="Skill"
                                placeholder="Ex. Coding etc."
                                variant="outlined"
                                size="small"
                                name="CheckOutTime"
                                type="datetime-local"
                                value={state.CheckOutTime}
                                onChange={this.handleTimeChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">ID Proof</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 292 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  ID
                                </InputLabel>

                                <Select
                                  error={state.IDProofFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.IDProof}
                                  name="IDProof"
                                  onChange={this.handleField}
                                  label="IDProof"
                                >
                                  {Array.isArray(state.IDProofList) &&
                                  state.IDProofList.length > 0 ? (
                                    state.IDProofList.map(function (
                                      data,
                                      index
                                    ) {
                                      // console.log('Field : ', data.fieldName)
                                      return (
                                        <MenuItem value={data} key={index}>
                                          {data}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Select>
                              </FormControl>
                            </div>

                            <div className="Input-Field">
                              <div className="Text">ID Number</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="ID Number"
                                error={state.IDNumberFlag}
                                variant="outlined"
                                size="small"
                                type="number"
                                name="IDNumber"
                                value={state.IDNumber}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">PinCode</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="PinCode"
                                placeholder="Ex: 4110048"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Pincode"
                                value={state.Pincode}
                                onChange={this.handleChangePinCode}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="Input-Field"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={this.handleUpdate}
                          >
                            {state.Update ? <>Update</> : <>Submit</>}
                            &nbsp;Application
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ margin: "10px 0 0 10px" }}
                            onClick={this.handleClose}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "250px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            color: "red",
                            fontSize: "20px",
                            fontFamily: "Roboto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            margin: " 0 0 50px 0",
                            fontWeight: 500,
                          }}
                        >
                          Are You Sure To Pay Bill For Booking ID{" "}
                          {state.CustomerID}&nbsp;?
                        </div>
                        <div style={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={() => {
                              this.handlePayCustomerBill(this.state.CustomerID);
                            }}
                          >
                            Yes
                          </Button>
                          <Button
                            variant="outlined"
                            style={{
                              margin: "10px 0 0 10px",
                              color: "white",
                              background: "black",
                            }}
                            onClick={this.handleClose}
                          >
                            No
                          </Button>
                        </div>
                      </div>
                    )}
                  </Fade>
                </Modal>

                {state.RejectApplication ? (
                  <Modal
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    open={this.state.RejectApplication}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={this.state.RejectApplication}>
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            width: 450,
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Are you sure you want to Reject ApplicationID{" "}
                          {this.state.ApplicationID}
                        </div>
                        <Button
                          variant="contained"
                          color="Secondary"
                          component="span"
                          style={{ margin: "10px 0 0 0" }}
                          onClick={() => {
                            this.handleApplicationDeletion(state.ApplicationID);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          // color="primary"
                          component="span"
                          style={{
                            margin: "10px 0 0 0",
                            background: "black",
                            color: "white",
                          }}
                          onClick={() => {
                            this.handleClose();
                          }}
                        >
                          Cancle
                        </Button>
                      </div>
                    </Fade>
                  </Modal>
                ) : null}
              </div>
            </div>
            {/* <Pagination
              count={this.state.TotalPages}
              Page={this.state.PageNumber}
              onChange={this.handlePaging}
              variant="outlined"
              shape="rounded"
              color="secondary"
            /> */}
          </div>
        </div>
        <Backdrop
          style={{ zIndex: "1", color: "#fff" }}
          open={this.state.OpenLoader}
          onClick={() => {
            this.setState({ OpenLoader: false });
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={state.OpenSnackBar}
          autoHideDuration={2000}
          onClose={this.handleSnackBarClose}
          message={state.Message}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackBarClose}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
