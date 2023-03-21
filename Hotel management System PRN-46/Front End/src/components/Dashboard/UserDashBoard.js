import React, { Component } from "react";
import "./UserDashBoard.css";

import AcRoom from "../asserts/Ac room.jpeg";
import NonAcRoom from "../asserts/non ac-rooms.png";

import SingleBedAcRoom from "../asserts/SingleBedAcRoom.jpg";
import DoubleBedACRoom from "../asserts/DoubleBedACRoom.jpg";

import SingleBedNonAcRoom from "../asserts/SingleBedNonAcRoom.jpg";
import DoubleBedNonAcRoom from "../asserts/DoubleBedNonACRoom.jpg";

import ProjectAdminServices from "../../services/ProjectAdminServices";
import ProjectUserServices from "../../services/ProjectUserServices";
import ProjectFeedbackServices from "../../services/ProjectFeedbackServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InfoIcon from "@material-ui/icons/Info";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import FeedbackIcon from "@material-ui/icons/Feedback";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import PersonPinRoundedIcon from "@material-ui/icons/PersonPinRounded";
import PersonPinOutlinedIcon from "@material-ui/icons/PersonPinOutlined";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const services = new ProjectAdminServices();
const userServices = new ProjectUserServices();
const feedbackServices = new ProjectFeedbackServices();

const MobileRegex = RegExp(/^[0-9]{11}$/i);
const PinCodeRegex = RegExp(/^[0-9]{7}$/i);
const EmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
);

export default class UserDashBoard extends Component {
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
      CustomerID: 0,
      RoomType: "", // Ac,NonAc
      RoomScenerio: "", // Single Bed, Double Bed
      RoomPrice: 0,
      TotalRoomPrice: 0,
      CustomerName: "",
      Contact: "",
      EmailID: "",
      Address: "",
      Age: 0,
      CheckInTime: "",
      CheckOutTime: "",
      IDProofList: ["Adhar Card", "Driving Licence", "Voting Card"],
      IDProof: "",
      IDNumber: "",
      Pincode: 0,
      //
      CustomerNameFlag: false,
      ContactFlag: false,
      EmailIDFlag: false,
      AddressFlag: false,
      AgeFlag: false,
      CheckInTimeFlag: false,
      CheckOutTimeFlag: false,
      IDProofFlag: false,
      IDNumberFlag: false,
      //List
      BookingList: [],
      //
      FeedBack: "",
      FeedBackFlag: false,
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      CurrentPage: 1,
      BookingPageNumber: 1,
      //
      TotalPages: 0,
      TotalRecords: 0,

      Open: false, // Flag For Open Feedback
      MenuOpen: false, // Open Menu
      OpenLoader: false,
      OpenSnackBar: false,

      OpenShow: true, // Select Menu In Drawer Or Not
      Update: false,

      OpenInfo: true,
      OpenAcList: false,
      OpenNonAcList: false,

      OpenMyBooking: false,
      OpenBookModel: false,
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    this.GetMasterData();
  }

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

  GetMasterData() {
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
          NoOfAcDoubleBedRoom: Number(data.data.data.doubleBedAcRoom),
          NoOfNonAcDoubleBedRoom: Number(data.data.data.doubleBedNonAcRoom),
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
        });
      })
      .catch((error) => {
        console.log("GetMasterData Error : ", error);
      });
  }

  handleCompanyName = async (e) => {
    console.log("Selected Company Name : ", e.target.value);
    this.setState({ CompanyName: e.target.value });
    this.handleJobFilter(
      this.state.PageNumber,
      e.target.value,
      this.state.JobStream,
      this.state.JobField
    );
  };

  handleFields = (event) => {
    console.log("Selected Job Field : ", event.target.value);
    this.setState({ JobField: event.target.value });
    this.handleJobFilter(
      this.state.PageNumber,
      this.state.CompanyName,
      this.state.JobStream,
      event.target.value
    );
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
      OpenArchive: false,
      OpenTrash: false,
      TotalPages: !this.state.OpenInsert ? 0 : this.state.TotalPages,
    });
  };

  CheckValidity() {
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

  handleSubmit = () => {
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

    this.CheckValidity();

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
        roomType: State.RoomType,
        roomScenerio: State.RoomScenerio,
        roomPrice: Number(State.TotalRoomPrice),
        customerName: State.CustomerName,
        contact: State.Contact,
        emailID: State.EmailID,
        address: State.Address,
        age: State.Age,
        checkInTime: State.CheckInTime,
        checkOutTime: State.CheckOutTime,
        idProof: State.IDProof,
        idNumber: State.IDNumber,
        pinCode: State.Pincode,
      };

      userServices
        .InsertCustomerDetail(data)
        .then((data) => {
          this.setState({
            OpenSnackBar: true,
            Open: false,
            OpenBookModel: false,
            Message: data.data.message,
          });
          this.GetMasterData();
          this.handleClose();
        })
        .catch((error) => {
          this.setState({
            OpenSnackBar: true,
            Open: false,
            OpenBookModel: false,
            Message: "Something Went Wrong",
          });
          this.GetMasterData();
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

    this.CheckValidity();

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
            Open: false,
            OpenBookModel: false,
            Message: data.data.message,
          });
          this.GetBookingList(this.state.BookingPageNumber);
          this.handleClose();
        })
        .catch((error) => {
          this.setState({
            OpenSnackBar: true,
            Open: false,
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

  handleOpenPayModel = (CustomerID) => {
    console.log("handleOpenPayModel Calling ... Customer ID : ", CustomerID);
    if (CustomerID !== undefined && CustomerID !== 0) {
      this.setState({
        CustomerID: CustomerID,
        Open: true,
        OpenPayBill: true,
        OpenBookModel: false,
      });
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
          this.setState({
            Open: false,
            OpenPayBill: false,
            OpenBookModel: false,
          });
          this.GetBookingList(this.state.BookingPageNumber);
        })
        .catch((error) => {
          console.log("handlePayCustomerBill Error : ", error);
          this.setState({
            Open: false,
            OpenPayBill: false,
            OpenBookModel: false,
          });
          this.GetBookingList(this.state.BookingPageNumber);
        });
    } else {
      console.log("Invalid Customer ID");
    }
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

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      Open: false,
      Update: false,
      OpenBookModel: false,
      RoomType: "", // Ac,NonAc
      RoomScenerio: "", // Single Bed, Double Bed
      RoomPrice: 0,
      TotalRoomPrice: 0,
      CustomerName: "",
      Contact: "",
      EmailID: "",
      Address: "",
      Age: 0,
      CheckInTime: "",
      CheckOutTime: "",
      IDProof: "",
      IDNumber: "",
      Pincode: 0,
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
  };

  handleFeedOpen = () => {
    this.setState({ Open: !this.state.Open });
  };

  handleOpenBookModel = (RoomType, RoomScenerio, RoomPrice) => {
    console.log(
      "handleOpenBookModel RoomType : ",
      RoomType,
      " RoomScenerio : ",
      RoomScenerio,
      " RoomPrice : ",
      RoomPrice
    );
    this.setState({
      Open: true,
      OpenBookModel: true,
      RoomType: RoomType,
      RoomScenerio: RoomScenerio,
      RoomPrice: RoomPrice,
    });
  };

  handleChanges = (e) => {
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

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleSubmitFeedback = async (e) => {
    this.setState({ FeedBackFlag: false });
    if (this.state.FeedBack) {
      let data = {
        feedback: this.state.FeedBack,
      };

      await feedbackServices
        .AddFeedback(data)
        .then((data) => {
          console.log("Feedback Data : ", data);
          this.setState({
            OpenSnackBar: true,
            FeedBackFlag: false,
            Open: false,
            Message: data.data.message,
          });
        })
        .catch((error) => {
          console.log("Feedback Error : ", error);
          this.setState({
            OpenSnackBar: true,
            FeedBackFlag: false,
            Open: false,
            Message: "Something Went Wrong.",
          });
        });
    } else {
      this.setState({
        OpenSnackBar: true,
        FeedBackFlag: true,
        Message: "Please Fill FeedBack",
      });
    }
  };

  handlePaging = (e, value) => {
    console.log("Current Page : ", value);
    this.handleJobFilter(
      value,
      this.state.CompanyName,
      this.state.JobStream,
      this.state.JobField
    );
  };

  SignOut = async () => {
    await localStorage.removeItem("customer_token");
    this.props.history.push("/SignIn");
  };

  handleField = (event) => {
    console.log(
      "Selected Name :",
      event.target.name,
      " Value : ",
      event.target.value
    );
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleOpenCurrentInfo = () => {
    this.setState({
      OpenShow: true,
      OpenInfo: true,
      OpenMyBooking: false,
      OpenAcList: false,
      OpenNonAcList: false,
    });
    this.GetMasterData();
  };

  handleOpenMyBooking = () => {
    this.setState({
      OpenShow: false,
      OpenMyBooking: true,
    });
    this.GetBookingList(this.state.BookingPageNumber);
  };

  OpenCurrentInfo = () => {
    // this.setState({ OpenInfo: true, OpenAcList: false, OpenNonAcList: false })
    return (
      <div className="Sub-OpenCurrentInfo">
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={AcRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward AC rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access,
                A/C.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                Available Room : {this.state.AvailableAcRoom}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                this.handleOpenBookAcRoom();
              }}
            >
              Next
            </Button>
          </CardActions>
        </Card>
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={NonAcRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Non Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward Non Ac rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                Available Room : {this.state.AvailableNonAcRoom}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                this.handleOpenBookNonAcRoom();
              }}
            >
              Next
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  };

  handleOpenBookAcRoom = () => {
    this.setState({ OpenInfo: false, OpenAcList: true, OpenNonAcList: false });
  };

  handleBookAcRoom = () => {
    return (
      <div className="Sub-OpenCurrentInfo">
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={SingleBedAcRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Single Bed Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward AC rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access,
                A/C.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                {this.state.AvailableSingleBedAcRoom == 0 ? (
                  <>No Room Available</>
                ) : (
                  <>Available Room : {this.state.AvailableSingleBedAcRoom}</>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {this.state.AvailableSingleBedAcRoom == 0 ? (
              <></>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  this.handleOpenBookModel(
                    "Ac",
                    "Single Bed",
                    this.state.AcSingleBedRoomPrice
                  );
                }}
              >
                Book My Room
              </Button>
            )}
          </CardActions>
        </Card>
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={DoubleBedACRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Double Bed Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward Non Ac rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                {this.state.AvailableDoubleBedAcRoom === 0 ? (
                  <>No Room Available</>
                ) : (
                  <>Available Room : {this.state.AvailableDoubleBedAcRoom}</>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {this.state.AvailableDoubleBedAcRoom === 0 ? (
              <></>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  this.handleOpenBookModel(
                    "Ac",
                    "Double Bed",
                    this.state.AcDoubleBedRoomPrice
                  );
                }}
              >
                Book My Room
              </Button>
            )}
          </CardActions>
        </Card>
      </div>
    );
  };

  handleOpenBookNonAcRoom = () => {
    this.setState({ OpenInfo: false, OpenAcList: false, OpenNonAcList: true });
  };

  handleBookNonAcRoom = () => {
    return (
      <div className="Sub-OpenCurrentInfo">
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={SingleBedNonAcRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Single Bed Non Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward AC rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access,
                A/C.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                {this.state.AvailableSingleBedNonAcRoom === 0 ? (
                  <>No Room Available</>
                ) : (
                  <>Available Room : {this.state.AvailableSingleBedNonAcRoom}</>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {this.state.AvailableSingleBedNonAcRoom === 0 ? (
              <></>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  this.handleOpenBookModel(
                    "Non Ac",
                    "Single Bed",
                    this.state.NonAcSingleBedRoomPrice
                  );
                }}
              >
                Book My Room
              </Button>
            )}
          </CardActions>
        </Card>
        <Card style={{ maxWidth: 400, height: 360, margin: 50 }}>
          <CardActionArea>
            <CardMedia
              style={{ height: 140 }}
              image={DoubleBedNonAcRoom}
              title="Contemplative Reptile"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Double Bed Non Ac Room
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Our deluxe ward Non Ac rooms are equipped with every feature
                imaginable. In these rooms, we provide wi-fi Internet access.
              </Typography>
              <Typography
                gutterBottom
                variant="h6"
                component="h4"
                style={{ margin: "10px 0 0  0" }}
              >
                {this.state.AvailableDoubleBedNonAcRoom === 0 ? (
                  <>No Room Available</>
                ) : (
                  <>
                    Available Room : {this.state.AvailableDoubleBedNonAcRoom}{" "}
                  </>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {this.state.AvailableDoubleBedNonAcRoom === 0 ? (
              <></>
            ) : (
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  this.handleOpenBookModel(
                    "Non Ac",
                    "Double Bed",
                    this.state.NonAcDoubleBedRoomPrice
                  );
                }}
              >
                Book My Room
              </Button>
            )}
          </CardActions>
        </Card>
      </div>
    );
  };

  handleOpenMyBookingList = () => {
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
                    Pay
                  </Button>
                ) : null}
                <IconButton
                  variant="outlined"
                  color="primary"
                  // size="medium"
                  onClick={() => {
                    self.handleEditMyBooking(data);
                  }}
                  // style={{ margin: '0 px 0 0' }}
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
      Open: true,
      Update: true,
      OpenBookModel: true,
      CustomerID: data.customerID,
      RoomType: data.roomType,
      RoomScenerio: data.roomScenerio,
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

  render() {
    let state = this.state;
    let self = this;
    console.log("State : ", state);
    return (
      <div className="UserDashBoard-Container">
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
                <Typography variant="h6" style={{ flexGrow: 2 }}>
                  User DashBoard
                </Typography>

                <Button
                  variant="outlined"
                  style={{ color: "white", marginRight: "50px" }}
                  onClick={() => {
                    this.handleFeedOpen();
                  }}
                >
                  Feedback &nbsp;
                  <FeedbackIcon />
                </Button>
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
                  onClick={() => {
                    this.handleOpenCurrentInfo();
                  }}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    {state.OpenShow ? (
                      <InfoIcon style={{ color: "white" }} />
                    ) : (
                      <InfoOutlinedIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Hotel Information</div>
                  ) : null}
                </div>
                <div
                  className={state.OpenMyBooking ? "NavButton1" : "NavButton2"}
                  onClick={() => {
                    this.handleOpenMyBooking();
                  }}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    {state.OpenMyBooking ? (
                      <PersonPinRoundedIcon style={{ color: "white" }} />
                    ) : (
                      <PersonPinOutlinedIcon style={{ color: "white" }} />
                    )}
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">My Booking</div>
                  ) : null}
                </div>
              </div>
              <div className={state.MenuOpen ? "SubBody21" : "SubBody22"}>
                <div style={{ height: "90%", width: "90%" }}>
                  {state.OpenShow
                    ? state.OpenInfo
                      ? this.OpenCurrentInfo()
                      : state.OpenAcList
                      ? this.handleBookAcRoom()
                      : this.handleBookNonAcRoom()
                    : state.OpenMyBooking
                    ? this.handleOpenMyBookingList()
                    : null}
                </div>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.Open}
                  // open={true}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.Open}>
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
                                onChange={this.handleChanges}
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
                                onChange={this.handleChanges}
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
                            onClick={
                              state.Update
                                ? this.handleUpdate
                                : this.handleSubmit
                            }
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
                    ) : state.OpenPayBill ? (
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
                          style={{ margin: "20px 0" }}
                        >
                          <TextField
                            error={this.state.FeedBackFlag}
                            id="outlined-multiline-static"
                            label="Feedback"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            name="FeedBack"
                            value={this.state.FeedBack}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div style={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={this.handleSubmitFeedback}
                          >
                            Submit Feedback
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
                    )}
                  </Fade>
                </Modal>
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
