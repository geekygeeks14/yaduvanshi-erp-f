import Axios from "axios";
import React, { Component } from "react";
import ReactTable from "react-table";
import { toast } from "react-toastify";
import { SETTING } from "../app-config/cofiguration";
import "react-toastify/dist/ReactToastify.css";
import { Button, Col, Form, Modal, Row,Card } from "react-bootstrap";
import BlockUi from "react-block-ui";
import Spinner from "../shared/Spinner";
import DatePicker from "react-datepicker";
import { AvField, AvForm } from "availity-reactstrap-validation";
import CreatableSelect from 'react-select/creatable';
import 'react-block-ui/style.css';
import { capitalize, convertMilliSecToHrMints, generateRandomID, logoutFunc, saveSecurityLogs, unitOption } from "../util/helper";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Webcam from "react-webcam";
import imageCompression from 'browser-image-compression';
toast.configure();
const mime = require('mime')
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL


const paymentOption =[
  {value:'Cash',label:'Cash'},
  {value:'Gpay',label:'Gpay'},
  {value:'Paytm',label:'Paytm'},
  {value:'phonePay',label:'phonePe'},
  {value:'Axis Bank',label:'Axis Bank'},
]

const imgOptions = {
  maxSizeMB: 0.1,
  maxWidthOrHeight: 1024,
  useWebWorker: true,
  fileType: 'image/png',             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
}
const USER = localStorage.getItem("userInformation") && JSON.parse(localStorage.getItem("userInformation"));
const menuUrl = window.location.href
export class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
          cmpName:'',
          cmpAdd:'',
          newProductCode:{},
          selectedProductCode:{},
          allPurchase: [],
          productData:[],
          loading:false,
          purchaseModal_basicInfo:false,
          purchaseModal_image: false,
          purchaseModal_product:false,
          loading2:false,
          deletePurchaseModal: false,
          purchaseProductDeleteModalShow:false,
          showProductModal:false,
          selectedCell:{},
          selectedProductCell:{},
          loading3:false,
          purchaseEditModal:false,
          loading4:false,
          freeSize: false,
          totalAmount:0,
          dueAmount:0,
          allWorker:[],
          allReciever:[],
          unLoadingWorkerList:[{workerId:''}],
          loadingWorkerList:[{workerId:''}],
          recieverModel: false,
          allProductCode:[],
          allProductName:[],
          allProductCodeData:[],
          allProductNameData:[],
          paymentList:[{}],
          unLoadingRowTime:0,
          loadingRowTime:0,
          grossWeight:0,
          tareWeight: 0,
          imageSrcfront:null,
          imageSrcback:null,
          imageSrcleft:null,
          imageSrcright:null,
          imageSrcslip:null,
          captureImage: false,
          readyTocapturefront:false,
          readyTocaptureback:false,
          readyTocaptureleft:false,
          readyTocaptureright:false,
          readyTocaptureslip:false,   
          videoConstraints :{
            //width: 400,
            //height: 400,
            facingMode: { exact: "environment" }
          },
          purchaseImageUpload:{},
          readyTocapture:false,
          unLoadingDateTime:{date: new Date(),startTime: new Date(),endTime: new Date()},
          loadingDateTime:{date: new Date(),startTime: new Date(),endTime: new Date()},
          purchaseProductList:[{productNameId:'', qty:0, unit:'', length:0, breadth:0, height:0, perUnitWeight:0}]
        };
        this.front_ref = React.createRef();
        this.back_ref = React.createRef();
        this.left_ref = React.createRef();
        this.right_ref = React.createRef();
        this.slip_ref = React.createRef();
        this.webcam_ref = React.createRef();
      }

      componentDidMount() {
        this.getAllPurchase();
        this.getAllProductCode()
        this.getAllProductName()
        this.getAllReciever()
        this.getAllWorker()
        saveSecurityLogs(menuUrl, "Menu Log")
      }

      async getAllPurchase(){
        this.setState({
          loading:true
        })
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.get(SETTING.APP_CONSTANT.API_URL+`admin/getAllPurchase`,{headers: options})
        .then((res) => {
          this.setState({
            loading:false
          })
          if (res && res.data.success) {
            // toast["success"](res.data.message);
       
            this.setState({
              allPurchase: res.data.purchaseData,
            })
            saveSecurityLogs(menuUrl, "Event Log")
          } else {
            toast["error"](res.data.message);
          }
        })
        .catch((err) =>{
          this.setState({
            loading:false
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while getting all purchase data.');
            saveSecurityLogs(menuUrl, "Error Log", err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }

       async getAllProductCode(){
        this.setState({
          loading:true
        })
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.get(SETTING.APP_CONSTANT.API_URL+`admin/getAllProductCode`,{headers: options})
        .then((res) => {
          this.setState({
            loading:false
          })
          if (res && res.data.success) {
            this.setState({
              allProductCode: res.data.productCodeData.map(data=> {return{
                ...data,
                label: data.productCode,
                value: data._id
              }}),
              allProductCodeData: res.data.allProductCodeData.map(data=> {return{
                ...data,
                label: data.productCode,
                value: data._id
              }})
            })
          } else {
            toast["error"](res.data.message);
          } 
        })
        .catch((err) =>{
          this.setState({
            loading:false
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while getting all Product Code.');
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }
       async getAllProductName(){
        this.setState({
          loading2:true
        })
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.get(SETTING.APP_CONSTANT.API_URL+`admin/getAllProductName`,{headers: options})
        .then((res) => {
          this.setState({
            loading2:false,
          })
          if (res && res.data.success) {
            this.setState({
              allProductName: res.data.productNameData,
              allProductNameData: res.data.allProductNameData
            })
          } else {
            toast["error"](res.data.message);
          } 
        })
        .catch((err) =>{
          this.setState({
            loading2:false,
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while getting all Product Name.');
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }

       async getAllReciever(){
        this.setState({
          loading:true
        })
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.get(SETTING.APP_CONSTANT.API_URL+`admin/getReciver`,{headers: options})
        .then((res) => {
          this.setState({
            loading:false
          })
          if (res && res.data.success) {
            this.setState({
              allReciever: res.data.data,
            })
          } else {
            toast["error"](res.data.message);
          } 
        })
        .catch((err) =>{
          this.setState({
            loading:false
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while getting all reciever list');
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }
       getAllWorker = async()=>{
        this.setState({
          loading:true
        })
      
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.get(SETTING.APP_CONSTANT.API_URL+`admin/getUser?userType=WORKER`,{headers: options})
        .then((res) => {
          this.setState({
            loading:false
          })
          if (res && res.data.success) {
            this.setState({
              allWorker: res.data.users,
            })
          } else {
            toast["error"](res.data.message);
          } 
        })
        .catch((err) =>{
          this.setState({
            loading:false,
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: "Error while getting worker");
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
      }


        addNewReciever=async(e, values)=>{
        this.setState({
          loading:true
        })

        const sendToData={
          recieverName: values.recieverName,
          phoneNumber: values.phoneNumber,
          companyId: USER && USER.userInfo && USER.userInfo.companyId? USER.userInfo.companyId: ''
        }
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.post(SETTING.APP_CONSTANT.API_URL+`admin/addReciever`,sendToData,{headers: options})
        .then((res) => {
          this.setState({
            loading:false
          })
          if (res && res.data.success) {
            this.setState({
              recieverModel: false,
            },()=>  this.getAllReciever())
          } else {
            toast["error"](res.data.message);
          } 
        })
        .catch((err) =>{
          this.setState({
            loading:false
          })
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while adding reciever');
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }

       submitNewProductName = async(e, values)=>{
        this.setState({
          loading2:true
        })
        let payload={
          productName: values.productName? capitalize(values.productName.trim()):'',
          companyId: USER && USER.userInfo.companyId,
        }
        let url ='admin/createProductName'
        
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        await Axios.post(SETTING.APP_CONSTANT.API_URL+url,payload,{headers: options})
        .then((res) => {
          if (res && res.data.success) {
            this.setState({
               productNameModel: false
            },()=> this.getAllProductName())
            //toast["success"](res.data.message);
            saveSecurityLogs(menuUrl, "Create/Add")
          } else {
            toast["error"](res.data.message);
          } 
          
        })
        .catch((err) =>{
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: `Error while ${this.state.edit?'updating':'creating'} product Name.`);
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }

      handleSubmit = async(e, values)=>{
          this.setState({
            loading2:true
          })
          const companyId= (USER && USER.userInfo.companyId)?USER.userInfo.companyId:USER._id
          let payload={}
          let url= 'admin/submitPurchaseData'
          if(this.state.purchaseModal_basicInfo){
             if(!this.state.newProductCode || (this.state.newProductCode && !this.state.newProductCode.value) ){
              toast.error(`Please select product code or enter product code`)
              return
             }
            const unLoadingWorkDetail={
              unLoadingWorker: values.unLoadingWorker,
              startTime: this.state.unLoadingDateTime.startTime,
              endTime: this.state.unLoadingDateTime.endTime,
              parentUserId: USER && USER.userInfo.userId,
              note: 'Unloading',
              truck:true,
              rowTime: new Date(this.state.unLoadingDateTime.endTime) - new Date(this.state.unLoadingDateTime.startTime),
              dateOfWork : this.state.unLoadingDateTime.date.toLocaleDateString()
            }
            const loadingWorkDetail={
              loadingWorker: values.loadingWorker,
              startTime: this.state.loadingDateTime.startTime,
              endTime: this.state.loadingDateTime.endTime,
              parentUserId: USER && USER.userInfo.userId,
              note: 'Loading',
              truck:true,
              rowTime: new Date(this.state.loadingDateTime.endTime) - new Date(this.state.loadingDateTime.startTime),
              dateOfWork : this.state.loadingDateTime.date.toLocaleDateString()
            }
            const purchaseBasicInfo={
              companyName: values.companyName,
              companyAdress: values.companyAdress,
              vehicleNumber: values.vehicleNumber,
              kantaName: values.kantaName,
              kantaNo :values.kantaNo,
              grossWeight: values.grossWeight,
              tareWeight: values.tareWeight,
              netWeight: values.netWeight,
              recieverId: values.recieverId,
              materialName: values.materialName,
            }
             payload={
              unLoadingWorkDetail: unLoadingWorkDetail,
              loadingWorkDetail: loadingWorkDetail,
              purchaseBasicInfo: purchaseBasicInfo,
              totalWeight:values.totalWeight,
              actualWeght: values.actualWeght,
              insertedBy : USER && USER._id,
              companyId: companyId,
              date: this.state.unLoadingDateTime.date,
              productCode : this.state.newProductCode
            }
          }
          if(this.state.purchaseModal_product){
            url= 'admin/updatePurchase'
            const purchaseProduct=values.purchaseProduct.map(data=> {
              return{
                ...data,
                randomId: generateRandomID(),
                deleted: false,
                created: new Date(),
                freeSize : this.state.freeSize, 
                productCodeId: this.state.selectedProductCode._id,
              }
            })
            payload={
              id: this.state.selectedCell._id,
              purchaseProduct: purchaseProduct,
            }
          }
  
          let options = SETTING.HEADER_PARAMETERS;
          options['Authorization'] = localStorage.getItem("token")
          await Axios.post(SETTING.APP_CONSTANT.API_URL+ url ,payload,{headers: options})
          .then((res) => {
            if (res && res.data.success) {
               if(url==='admin/submitPurchaseData'){
                this.getAllProductCode()
               }
              toast["success"](res.data.message);
             
              this.handleClose()
              saveSecurityLogs(menuUrl, "Create/Add")
            } else {
              toast["error"](res.data.message);
            } 
          })
          .catch((err) =>{
            if(err && err.success===false  ){
              const errorMessage= err.message? err.message: 'Error while submitting purchase data.'
              toast["error"](errorMessage);
              saveSecurityLogs(menuUrl, "Error Log", errorMessage)
              this.handleClose()
            }else{
              logoutFunc(err)
              saveSecurityLogs(menuUrl, "Logout")
            }
          });
      }

      handleSubmitImage = async()=>{
        const {selectedCell} = this.state
        function dataURLtoFile(dataurl, filename) {
          var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {type:mime});
        }
  
        function isBase64(src) {
          // Check if the src starts with "data:image/"
          return src.startsWith("data:image/")?true:false;
        }
     
        let formData = new FormData();
        if(this.state.captureImage ){
          if(!this.state.imageSrcfront){
            toast.error("Please upload vehicle front image")
            return 
          }
          if(!this.state.imageSrcback){
            toast.error("Please upload vehicle back image")
            return 
          }
          if(!this.state.imageSrcleft){
            toast.error("Please upload vehicle left image")
            return 
          }
          if(!this.state.imageSrcright){
            toast.error("Please upload vehicle right image")
            return 
          }
          if(!this.state.imageSrcslip){
            toast.error("Please upload kanta slip image")
            return 
          }
          // this.setState({
          //   loading2:true
          // })
          // const {purchaseImageUpload}= this.state.selectedDoc 
          // if(purchaseImageUpload.vehicle_front_image_file){
          //   toast.error("Please upload vehicle front image")
          //   return 
          // }
          // if(purchaseImageUpload.vehicle_back_image_file){
          //   toast.error("Please upload vehicle front image")
          //   return 
          // }
          // if(purchaseImageUpload.vehicle_left_image_file){
          //   toast.error("Please upload vehicle front image")
          //   return 
          // }
          // if(purchaseImageUpload.vehicle_right_image_file){
          //   toast.error("Please upload vehicle front image")
          //   return 
          // }
          // if(purchaseImageUpload.kanta_slip_image_file){
          //   toast.error("Please upload kanta slip image")
          //   return 
          // }
          // const compr_truck_front_image = await imageCompression(purchaseImageUpload.truck_front_image_file, imgOptions);
          // const compr_truck_back_image = await imageCompression(purchaseImageUpload.truck_back_image_file, imgOptions);
          // const compr_truck_left_image = await imageCompression(purchaseImageUpload.truck_left_image_file, imgOptions);
          // const compr_truck_right_image = await imageCompression(purchaseImageUpload.truck_right_image_file, imgOptions);
          // const compr_kanta_slip_image = await imageCompression(purchaseImageUpload.kanta_slip_image_file, imgOptions);
          
          formData.append('id', selectedCell._id);
          // formData.append('vehicle_front_image_name', purchaseImageUpload.vehicle_front_image_name)
          // formData.append('vehicle_front_image_file', await imageCompression(purchaseImageUpload.vehicle_front_image_file, imgOptions));
          // formData.append('vehicle_back_image_name', purchaseImageUpload.vehicle_back_image_name)
          // formData.append('vehicle_back_image_file', await imageCompression(purchaseImageUpload.vehicle_back_image_file, imgOptions));
          // formData.append('vehicle_left_image_name', purchaseImageUpload.vehicle_left_image_name)
          // formData.append('vehicle_left_image_file', await imageCompression(purchaseImageUpload.vehicle_left_image_file, imgOptions));
          // formData.append('vehicle_right_image_name', purchaseImageUpload.vehicle_right_image_name)
          // formData.append('vehicle_right_image_file', await imageCompression(purchaseImageUpload.vehicle_right_image_file, imgOptions));
          // formData.append('kanta_slip_image_name', purchaseImageUpload.kanta_slip_image_name)
          // formData.append('kanta_slip_image_file', await imageCompression(purchaseImageUpload.kanta_slip_image_file, imgOptions));
          if(this.state.imageSrcfront && isBase64(this.state.imageSrcfront)){
            const front_name =  this.genFileName(`vehicle_front_image`)
            formData.append('vehicle_front_image_name',front_name)
            formData.append('vehicle_front_image_file',dataURLtoFile(this.state.imageSrcfront, front_name));
       
          }
          if(this.state.imageSrcback && isBase64(this.state.imageSrcback)){
            const back_name =  this.genFileName(`vehicle_back_image`)
            formData.append('vehicle_back_image_name', back_name)
            formData.append('vehicle_back_image_file', dataURLtoFile(this.state.imageSrcback, back_name));
          
          }
          if(this.state.imageSrcleft && isBase64(this.state.imageSrcleft)){
            const left_name =  this.genFileName(`vehicle_left_image`)
            formData.append('vehicle_left_image_name', left_name)
            formData.append('vehicle_left_image_file', dataURLtoFile(this.state.imageSrcleft, left_name));
          }
          if(this.state.imageSrcright && isBase64(this.state.imageSrcright)){
            const right_name =  this.genFileName(`vehicle_right_image`)
            formData.append('vehicle_right_image_name', right_name)
            formData.append('vehicle_right_image_file', dataURLtoFile(this.state.imageSrcright, right_name));
          }
          if(this.state.imageSrcslip && isBase64(this.state.imageSrcslip)){
            const slip_name =  this.genFileName(`kanta_slip_image`)
            formData.append('kanta_slip_image_name', slip_name)
            formData.append('kanta_slip_image_file', dataURLtoFile(this.state.imageSrcslip, slip_name));
          }
        }

        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
        //options['Content-Type']= 'multipart/form-data'
        await Axios.post(SETTING.APP_CONSTANT.API_URL+`admin/updatePurchase`,formData,{headers: options})
        .then((res) => {
          if (res && res.data.success) {
            toast["success"](res.data.message);
            //saveSecurityLogs(menuUrl, "update")
          } else {
            toast["error"](res.data.message);
          } 
          this.handleClose()
        })
        .catch((err) =>{
          this.handleClose()
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while submitting purchase image data.');
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
    }

      addMoreRow=()=>{
        const newRow=[{productNameId:'', qty:0, unit:'', length:0, breadth:0, height:0, perUnitWeight:0}]
        this.setState({purchaseProductList:[...this.state.purchaseProductList,...newRow]})
       }
       
       purchaseModelOpen=()=>{
        this.setState({
            purchaseModal_basicInfo:true
        })
       }
       handleClose=()=>{
        this.setState({
            purchaseModal_basicInfo:false,
            purchaseModal_product:false,
            loading:false,
            loading2:false,
            deletePurchaseModal:false,
            showProductModal:false,
            selectedCell:{},
            loading3:false,
            loading4:false,
            totalAmount:0,
            dueAmount:0,
            purchaseEditModal:false,
            unLoadingWorkerList:[{workerId:''}],
            loadingWorkerList:[{workerId:''}],
            paymentList:[{}],
            captureImage:false,
            imageSrcfront:null,
            imageSrcback: null,
            imageSrcleft: null,
            imageSrcright: null,
            imageSrcslip: null,
            readyTocapturefront:false,
            readyTocaptureback:false,
            readyTocaptureleft:false,
            readyTocaptureright:false,
            readyTocaptureslip:false,   
            purchaseProductList:[{productNameId:'',image:'', qty:0, length:0, breadth:0, height:0, perUnitWeight:0}]
        },()=> this.getAllPurchase())
       }

       handleCloseDeleteModel=()=>{
          this.setState({
            deletePurchaseModal:false,
            selectedCell:{},
          })
       }
       handleCloseEditModel=()=>{
        this.setState({
          purchaseEditModal:false,
          selectedCell:{},
        })
       }

       handleClosePuchaseModel=()=>{
        this.setState({
            purchaseModal_basicInfo:false,
            purchaseModal_product:false,
            loading:false,
            loading2:false,
            deletePurchaseModal:false,
            showProductModal:false,
            selectedCell:{},
            loading3:false,
            loading4:false,
            totalAmount:0,
            dueAmount:0,
            purchaseEditModal:false,
            unLoadingWorkerList:[{workerId:''}],
            loadingWorkerList:[{workerId:''}],
            paymentList:[{}],
            captureImage:false,
            imageSrcfront:null,
            imageSrcback: null,
            imageSrcleft: null,
            imageSrcright: null,
            imageSrcslip: null,
            readyTocapturefront:false,
            readyTocaptureback:false,
            readyTocaptureleft:false,
            readyTocaptureright:false,
            readyTocaptureslip:false,   
            purchaseProductList:[{productNameId:'', qty:0, unit:'',length:0, breadth:0, height:0, perUnitWeight:0}]
        })
       }

       deleteToggle =(cell)=>{
        // this.setState({
        //   selectedCell: cell,
        //   deletePurchaseModal:true
        // })
       }

       imageToggle=(cell)=>{
        this.setState({
          selectedCell: cell,
          //purchaseModal_image:true
          captureImage: true,
          imageSrcfront:(cell.vehicleImage && cell.vehicleImage.front)?IMAGE_BASE_URL+cell.vehicleImage.front+'.jpg':null,
          imageSrcback: (cell.vehicleImage && cell.vehicleImage.back)? IMAGE_BASE_URL+cell.vehicleImage.back+'.jpg':null,
          imageSrcleft: (cell.vehicleImage && cell.vehicleImage.left)? IMAGE_BASE_URL+cell.vehicleImage.left+'.jpg':null,
          imageSrcright:(cell.vehicleImage && cell.vehicleImage.right)? IMAGE_BASE_URL+cell.vehicleImage.right+'.jpg':null,
          imageSrcslip: (cell.kantaSlipImage) ? IMAGE_BASE_URL+cell.kantaSlipImage+'.jpg':null,
        })
       }

       productToggle=(cell)=>{
          this.setState({
            selectedCell: cell,
            purchaseModal_product:true,
            selectedProductCode: this.state.allProductCodeData.find(data=> data._id.toString()===cell.productCodeId)
          })
       }

       editToggle=(cell)=>{
        this.setState({
          selectedCell: cell,
          purchaseEditModal:true
        })
       }
       deleteHandle=async()=>{
        this.setState({
          loading3:true
        })
       
        let options = SETTING.HEADER_PARAMETERS;
        options['Authorization'] = localStorage.getItem("token")
         await Axios.delete(SETTING.APP_CONSTANT.API_URL+`admin/deletePurchaseData/`+this.state.selectedCell._id,{headers: options})
        .then((res) => {
          if (res && res.data.success) {
            // toast["success"](res.data.message);
            saveSecurityLogs(menuUrl, "Delete")
          } else {
            toast["error"](res.data.message);
          }
          this.handleClose()
        })
        .catch((err) =>{
          this.handleClose()
          if(err && err.success===false  ){
            toast["error"](err.message? err.message: 'Error while deleting purchase data.');
            saveSecurityLogs(menuUrl, "Error Log",err.message)
          }else{
            logoutFunc(err)
            saveSecurityLogs(menuUrl, "Logout")
          }
        });
       }

       ShowProduct=(cell)=>{
        this.setState({
          showProductModal:true,
          selectedCell: cell
        })
      }
      showProductClose =(cell)=>{
        this.setState({
          showProductModal:false,
          selectedCell:cell
        })
      }
      addMorePayment=()=>{
        this.setState({
          paymentList:[...this.state.paymentList,{}],
        })
      }
      calculateTotalWeight = () => {
        let totalWeight =0;
        this.state.purchaseProductList.forEach((it)=>{
            if(!!it.rowWeight && parseFloat (it.rowWeight) > 0){
              totalWeight += parseFloat(it.rowWeight);
            }
        });
        this.setState({ totalWeight:totalWeight.toFixed(2) })
      };

      calculateField = (e, rowIndex) => { 
        let data = [...this.state.purchaseProductList]; 
        let num1 = !!data[rowIndex].perUnitWeight ? parseFloat(data[rowIndex].perUnitWeight) : 0; 
        let num2 = !!data[rowIndex].qty ? parseFloat(data[rowIndex].qty) : 0;
        let lineTotalWeight= (num1 * num2 ).toFixed(2);  
        data[rowIndex]['rowWeight'] = lineTotalWeight;
        this.setState({ purchaseProductList:data}, 
          ()=>{this.calculateTotalWeight()}
          );
      };

      onChangeReciever=(e)=>{
         if(e.target.value ==='create_new'){
            this.setState({
              recieverModel: true
            })
         }
      }
      handleCloseRecieverModel=()=>{
        this.setState({
          recieverModel: false
        })
      }
      updateWorkerField=(rowIndex, workType) => e=>{
        let data = [...this.state[`${workType}WorkerList`]];
        data[rowIndex]['workerId'] = e.target.value;
        this.setState({ [`${workType}WorkerList`]:data },
          // ()=>{this.calculatePaymentAmount()}
          );        

      }
      addMoreWoker=(workType)=>{
        const newRow=[{workerId:''}]
        this.setState({[`${workType}WorkerList`]:[...this.state[`${workType}WorkerList`], ...newRow]})
       }
      removeRow = (index, workType)=> {
        let workerList = this.state[`${workType}WorkerList`]
        if(workerList.length>1){
          workerList.splice(index, 1);
          this.setState({
            [`${workType}WorkerList`]: workerList
          })
        }else{
          toast["error"]('This is required row.');
        }
      }
      addMoreRowPurchaseProduct=()=>{
        const newRow=[{productNameId:'',image:'', qty:0, length:0, breadth:0, height:0, perUnitWeight:0}]
        this.setState({purchaseProductList:[...this.state.purchaseProductList, ...newRow]})
       }
      updateProductField=(rowIndex,key) => e=>{
        if(e.target.value==='new_create'){
          this.setState({
            productNameModel:true
          })
        }else{
          let data = [...this.state.purchaseProductList];
          data[rowIndex][key] = e.target.value;
          this.setState({ purchaseProductList:data });    
        }
           
      }
      removeRowProduct = (index)=> {
        let purchaseProductList = this.state.purchaseProductList
        if(purchaseProductList.length>1){
          purchaseProductList.splice(index, 1);
          this.setState({purchaseProductList})
        }else{
          toast["error"]('This is required row.');
        }
      }

      productNameModelClose=()=>{
        this.setState({
          productNameModel:false
        })
      }
      handleDate=(timeDate, action, workType)=>{
        let workDateTime = this.state[`${workType}DateTime`]
        if(action==='date'){
          workDateTime.date = timeDate
          this.setState({
            [`${workType}DateTime`]: workDateTime
          })
        }
        if(action==='startTime'){
          workDateTime.startTime = timeDate
          this.setState({
            [`${workType}DateTime`]: workDateTime
          },()=>this.calculateRowTime(workType))
        }
        if(action==='endTime'){
          workDateTime.endTime = timeDate
          this.setState({
            [`${workType}DateTime`]: workDateTime
          },()=>this.calculateRowTime(workType))
        }
      }
      calculateRowTime=(workType)=>{
      let  workDateTime = this.state[`${workType}DateTime`]
            if(workDateTime.startTime && workDateTime.endTime && workDateTime.endTime>workDateTime.startTime ){
                this.setState({
                  [`${workType}RowTime`]: new Date (workDateTime.endTime)- new Date(workDateTime.startTime)
                })
            }else{
              this.setState({
                [`${workType}RowTime`]: 0
              })
            }
      }
      onChangeCmpName=(e)=>{
        this.setState({
          cmpName: e.target.value
        },
        //()=>this.uniqueProductCodeGen()
        )
      }
      onChangeCmpAdd=(e)=>{
        this.setState({
          cmpAdd: e.target.value
        },
        //()=> this.uniqueProductCodeGen()
        )
      }

      generateRandomName=(strings, fixedLength) =>{
        // Convert the input strings into an array
        const stringArray = strings.split(' ');
      
        // Calculate the available length for each part (prefix, middle, suffix)
        const availableLength = fixedLength / 3;
      
        // Generate a random prefix, middle part, and suffix from the input strings
        const prefix = this.getRandomPart(stringArray, availableLength);
        const suffix = this.getRandomPart(stringArray, availableLength);
        const middlePartLength = fixedLength - prefix.length - suffix.length;
        const middlePart = this.getRandomPart(stringArray, middlePartLength);
      
        // Concatenate the prefix, middle part, and suffix to form the final name
        const randomName = prefix + middlePart + suffix;
      
        // Truncate or pad the name to fit the fixed length
        if (randomName.length > fixedLength) {
          return randomName.slice(0, fixedLength);
        } else if (randomName.length < fixedLength) {
          const padding = 'X'.repeat(fixedLength - randomName.length);
          return randomName + padding;
        }
      
        return randomName.toUpperCase();
      }
      
       getRandomPart=(partsArray, length)=> {
        let randomPart = '';
        while (randomPart.length < length) {
          randomPart += partsArray[Math.floor(Math.random() * partsArray.length)];
        }
      
        // Truncate or pad the part to fit the available length
        randomPart = randomPart.slice(0, length);
        return randomPart;
      }

      handleRequiredSize=()=>{
        this.setState({
          freeSize: !this.state.freeSize
        })
      }

      uniqueProductCodeGen =()=>{
        if(!this.state.cmpName){
          toast.error("Please enter company name")
          return
        }
        if(!this.state.cmpAdd){
          toast.error("Please enter company address")
          return
        }
        const cmpAdd=  this.state.cmpAdd
        const cmpName=  this.state.cmpName
        const inputStrings = cmpAdd+' '+ cmpName;
        const fixedLength = 12;
        let randomName=''
        let randomNameExist=true
        while(randomNameExist){
          const newRandomName = this.generateRandomName(inputStrings, fixedLength);
          const foundProductCode= this.state.allProductCodeData.find(data => data.label.toLowerCase()===newRandomName)
          if(!foundProductCode){
            randomNameExist=false
            randomName= newRandomName
          }
        }
        this.setState({
          newProductCode:{label:randomName, value:randomName}
        })
      }
      onChnageProductCode=(e)=>{
        this.setState({
          newProductCode:e
        })
      }
      fileUploadAction = (name) =>{
        console.log("namenamenamenamename", name)
        this[`${name}_ref`].current.click()
      }
      fileUploadInputChange = (e) =>{
        console.log("eeeeeeeeee", e.target.files[0])
        console.log("eeeeeeeeee", e.target.value)

        this.setState({
          fileUploadState:e.target.value,
          selectedFile: e.target.files[0],
          preview: URL.createObjectURL(e.target.files[0])
        });
      }
   genUniqueNumber=()=>{
    return `${new Date().getMilliseconds()}${Math.floor(Math.random() * 900000) + 100000}`;
   }
   genFileName=(docType, docExtension=`jpeg`)=>{
    const uniqueNumber = `${new Date().getMilliseconds()}${Math.floor(Math.random() * 900000) + 100000}`;
    return  uniqueNumber + '_'+ docType + '.' + docExtension;
   }

  fileSelect =  docUploadType =>e  => {
      console.log("docUploadTypedocUploadType", docUploadType)
      const uniqueNumber = this.genUniqueNumber()
      const selectedFile= e.target.files[0]
       if (selectedFile) {
            const doc = selectedFile
            // const bmmsId= USER.userInfo.userId
            // const slectedtUserId= USER._id
            const isValidExtension = doc ? ['png', 'jpg', 'jpeg'].includes(mime.getExtension(mime.getType(doc.name))) : false
            if(isValidExtension){
                const fileName = uniqueNumber + '_'+ docUploadType + '.' + mime.getExtension(mime.getType(doc && doc.name));
               
              let purchaseImageUpload= this.state.purchaseImageUpload
                purchaseImageUpload={
                  ...purchaseImageUpload,
                  [`${docUploadType}_name`]: fileName,
                  [`${docUploadType}_file`]: selectedFile,
                  [`${docUploadType}_preview`]: URL.createObjectURL(selectedFile)
                }
          
              this.setState({purchaseImageUpload},()=> console.log("purchaseImageUploadpurchaseImageUpload", purchaseImageUpload))
            } else {
              this.setState({
                loading2:false,
                })
                toast.error(`Please select supported files "'png', 'jpg', 'jpeg'"`);
                document.getElementById(e.target.id).value = "";
            }
        }
        else {
            toast.error('Please select the document type to upload the file');
            document.getElementById("document").value = "";
        }
    }

  fileUpload = async () => {
    // this.setState({
    //   loading2:true
    // })
    const {selectedDoc} = this.state
    const imageFile = selectedDoc.imageFile
    const fileName = selectedDoc.fileName
    const imgOptions = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/png',             // optional, fileType override e.g., 'image/jpeg', 'image/png' (default: file.type)
    }
    try {
      const compressedFile = await imageCompression(imageFile, imgOptions);
      const formData = new FormData();
      formData.append('avatar', compressedFile,fileName);
      formData.append('fileName', fileName.toString())
      formData.append('file', imageFile);
    
      let options = SETTING.HEADER_PARAMETERS;
      options['Authorization'] = localStorage.getItem("token")
       await Axios.post(SETTING.APP_CONSTANT.API_URL+`admin/uploadImage/`,formData,{headers: options})
      .then((res) => {
        if (res && res.data.success) {
          toast["success"](res.data.message);
          this.setState({
            allSell: res.data.data,
          })
          saveSecurityLogs(menuUrl, "Event Log")
        } else {
          toast["error"](res.data.message);
        } 
        //this.handleClose()
      })
      .catch((err) =>{
        //this.handleClose()
        if(err && err.success===false  ){
          toast["error"](err.message? err.message: 'Error.');
          saveSecurityLogs(menuUrl, "Error Log",err.message)
        }else{
          //logoutFunc(err)
      }
      });
    } catch (error) {
      this.setState({
        loading2:false
      })
      console.log(error);
      toast["error"]("Error while upload doc/photo. Please try again");
    }
  }
  capture = (docType) => {
    if(this.state[`readyTocapture${docType}`]){
      const imageSrc = this[`${docType}_ref`].current.getScreenshot();
      this.setState({
        [`imageSrc${docType}`]:imageSrc,
        [`readyTocapture${docType}`]:false
      })
    }else{
      if(docType && docType==='front'){
        this.setState({
          [`readyTocapture${docType}`]: true,
          readyTocaptureback:false,
          readyTocaptureleft:false,
          readyTocaptureright:false,
          readyTocapturerslip:false
        })
      }
      if(docType && docType==='back'){
        this.setState({
          [`readyTocapture${docType}`]: true,
          readyTocapturefront:false,
          readyTocaptureleft:false,
          readyTocaptureright:false,
          readyTocapturerslip:false
        })
      }
      if(docType && docType==='left'){
        this.setState({
          [`readyTocapture${docType}`]: true,
          readyTocapturefront:false,
          readyTocaptureback:false,
          readyTocaptureright:false,
          readyTocapturerslip:false
        })
      }
      if(docType && docType==='right'){
        this.setState({
          [`readyTocapture${docType}`]: true,
          readyTocapturefront:false,
          readyTocaptureback:false,
          readyTocaptureleft:false,
          readyTocapturerslip:false
        })
      }
      if(docType && docType==='slip'){
        this.setState({
          [`readyTocapture${docType}`]: true,
          readyTocapturefront:false,
          readyTocaptureback:false,
          readyTocaptureleft:false,
          readyTocapturerright:false
        })
      }
    }
  };
  hideCaptureImage=()=>{
    this.setState({
      captureImage: false,
      imageSrcfront:null,
      imageSrcback: null,
      imageSrcleft: null,
      imageSrcright:null,
      imageSrcslip: null,
      readyTocapturefront:false,
      readyTocaptureback:false,
      readyTocaptureleft:false,
      readyTocaptureright:false,
      readyTocaptureslip:false    
    })
  }
  reTake=(docType)=>{
    this.setState({
      [`imageSrc${docType}`]:null,
      [`readyTocapture${docType}`]: true
    })
  }
  flipCamera=()=>{
    let videoConstraints= this.state.videoConstraints
    if(videoConstraints.facingMode && videoConstraints.facingMode && videoConstraints.facingMode.exact){
      videoConstraints={
        ...videoConstraints,
        facingMode:  "user"
      }
    }else{
      videoConstraints={
        ...videoConstraints,
        facingMode:  { exact: "environment" }
      }
    }
    this.setState({
      videoConstraints
    })
  }
  shortWeightCalculate=(cell)=>{

    const netWeight=  Number(cell.purchaseBasicInfo.netWeight)
    const productTotalWt= cell.purchaseProduct.reduce((acc, curr)=> acc+ Number(curr.rowWeight), 0)
    const diff= productTotalWt-netWeight
    return productTotalWt>netWeight?`+${diff}`:`-${diff}`
  }

  deletePurchaseProductToggle=(cell)=>{
    console.log("cellcellcell", cell)
     console.log("selected selectedCell", this.state.selectedCell)
    this.setState({
      selectedProductCell: cell,
      purchaseProductDeleteModalShow:true
    })
   }
   purchaseProductDeleteModalClose=()=>{
    this.setState({
      selectedCell:{},
      selectedProductCell: {},
      purchaseProductDeleteModalShow:false
    })
   }
   deleteHandlePurchaseProduct=async()=>{
    this.setState({
      loading4:true
    })
    let payload={
        id: this.state.selectedCell._id,
        selectedProduct: this.state.selectedProductCell
    }
    let options = SETTING.HEADER_PARAMETERS;
    options['Authorization'] = localStorage.getItem("token")
     await Axios.post(SETTING.APP_CONSTANT.API_URL+`admin/deletePurchaseProduct`,payload,{headers: options})
    .then((res) => {
      if (res && res.data.success) {
        // toast["success"](res.data.message);
        saveSecurityLogs(menuUrl, "Delete")
      } else {
        toast["error"](res.data.message);
      }
      this.handleClose()
    })
    .catch((err) =>{
      this.handleClose()
      if(err && err.success===false  ){
        const errorMessage= err.message? err.message: 'Error while deleting purchase data.'
        toast["error"]();
        saveSecurityLogs(menuUrl, "Error Log",errorMessage)
      }else{
        logoutFunc(err)
        saveSecurityLogs(menuUrl, "Logout")
      }
    });
  }

  render() {
    const {selectedCell, unLoadingDateTime, loadingDateTime,purchaseImageUpload, videoConstraints, freeSize}= this.state
    const productColumn =[
      {
        Header: "Product Name",
        accessor: "productName",
        Cell: (cell) => {
          if(cell.original.productNameId){
            const productNameFound= this.state.allProductNameData.find(data=>data._id === cell.original.productNameId)
            return productNameFound && productNameFound.productName ? productNameFound.productName:'N/A'
          }else{
            return  'N/A'
          }
        }
      },
      {
        Header: "Length",
        accessor: "length",
        Cell: (cell) => {
          return cell.original.length ? cell.original.length:'N/A'
        }
      },
      {
        Header: "Breadth",
        accessor: "breadth",
        Cell: (cell) => {
          return cell.original.breadth ? cell.original.breadth:'N/A'
        }
      },
      {
        Header: "Height",
        accessor: "height",
        Cell: (cell) => {
          return cell.original.height ? cell.original.height:'N/A'
        }
      },
      {
        Header: "Per Unit Weight",
        accessor: "perUnitWeight",
        Cell: (cell) => {
          return cell.original.perUnitWeight ? cell.original.perUnitWeight:'N/A'
        }
      },
   
      {
        Header: "Qty",
        accessor: "qty",
        Cell: (cell) => {
          return cell.original.qty ? cell.original.qty:'N/A'
        }
      },
      {
        Header: "Product Total Weight",
        accessor: "rowWeight",
        Cell: (cell) => {
          return cell.original.rowWeight ? cell.original.rowWeight:'N/A'
        }
      },
      // {
      //   Header: "Action",
      //   width: 150,
      //   Cell:cell=>{
      //     return(

      //         <Row style={{marginLeft:"0.1rem", marginTop:"0px"}}>
      //             <a href="#/" title='Delete' id={'delete'}
      //               className="mb-2 badge" 
      //                 onClick={e=>this.deletePurchaseProductToggle(cell.original)
      //               }>
      //                 <i className=" mdi mdi-delete mdi-18px"></i>
      //             </a>
      //         </Row>
      //     )
      //   }
      // }
    ]
    
    const columns = [
        {
          Header: "Date/Time",
          accessor: "created",
          width: 155,
          // Cell: (cell) => {
          //   return  new Date(cell.original.created).toLocaleDateString("en-GB")
          // },
          Cell: (cell) => {
            return new Date(cell.original.created)
              .toLocaleString("en-GB", {
                hour12: true,
              })
              .toUpperCase();
          },
        },
        {
          Header: "Company Name",
          accessor: "companyName",
          Cell: (cell) => {
            return  cell.original.purchaseBasicInfo &&  cell.original.purchaseBasicInfo.companyName?cell.original.purchaseBasicInfo.companyName:'NA'
          },
        },
        {
          Header: "Products",
          accessor: "products",
          Cell: (cell) => {
            return  (
              <Link to="#" onClick={()=>this.ShowProduct(cell.original)}>Product Detail</Link>
            )}
        },
        {
          Header: "Net Wt.",
          accessor: "netWeight",
          Cell: (cell) => {
            return  cell.original.purchaseBasicInfo &&  cell.original.purchaseBasicInfo.netWeight?cell.original.purchaseBasicInfo.netWeight:'NA'
          },
        },
        {
          Header: "Gross Wt.",
          accessor: "grossWeight",
          Cell: (cell) => {
            return  cell.original.purchaseBasicInfo &&  cell.original.purchaseBasicInfo.grossWeight?cell.original.purchaseBasicInfo.grossWeight:'NA'
          },
        },
        {
          Header: "Tare Wt.",
          accessor: "tareWeight",
          Cell: (cell) => {
            return  cell.original.purchaseBasicInfo &&  cell.original.purchaseBasicInfo.tareWeight?cell.original.purchaseBasicInfo.tareWeight:'NA'
          },
        },
        {
          Header: "Short Weight",
          accessor: "shortWeight",
          Cell: (cell) => this.shortWeightCalculate(cell.original)
          
        },
        // {
        //   Header: "vehicle Number",
        //   accessor: "vehicleNumber",
        //   Cell: (cell) => {
        //     return cell.original.vehicleInfo &&  cell.original.vehicleInfo.length>0? cell.original.vehicleInfo[0].vehicleNumber:'N/A'
        //   }
        // },
        // {
        //   Header: "Total Amount",
        //   accessor: "amount",
        //   Cell: (cell) => {
        //     return  cell.original.totalAmount? cell.original.totalAmount:'0.00'
        //   }
        // },
        // {
        //   Header: "Mode Payment",
        //   accessor: "payInfo",
        //   Cell: (cell) => {
        //     return cell.original.payInfo && cell.original.payInfo.length>0?cell.original.payInfo[0].payMode:'N/A'
        //   }
        // },
        {
          Header: "Action",
          // show:USER && USER.userInfo && USER.userInfo.role && USER.userInfo.role==='TOPADMIN'?true:true,
          width: 150,
          Cell:cell=>{
            return(
                <Row style={{marginLeft:"0.1rem", marginTop:"0px"}}>
                    {/* <a href="#/" title='Delete' id={'delete'}
                      className="mb-2 badge" 
                        onClick={e=>this.deleteToggle(cell.original)
                      }>
                        <i className=" mdi mdi-delete mdi-18px"></i>
                    </a> */}
                    <a href="#/" title='Edit' id={'image'}
                      className="mb-2 badge" 
                        onClick={e=>this.imageToggle(cell.original)
                      }>
                        <i className=" mdi mdi-file-image mdi-18px"></i>
                    </a>
                    <a href="#/" title='Product' id={'product'}
                      className="mb-2 badge" 
                        onClick={e=>this.productToggle(cell.original)
                      }>
                        <i className="mdi mdi-database-plus mdi-18px"></i>
                    </a>
                </Row>
            )
          }
        }
      ];
    return (
        <div>
        <BlockUi tag="div"  blocking={this.state.loading} className="block-overlay-dark" loader={<Spinner/>}>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <p className="card-title">All Purchase</p>
                <p className="card-title2">Total Purchase Count: {this.state.allPurchase.length}</p>
                <Row>
                <Col md={4}>
                <Form.Group>
                  <Button className="btn btn-primary text-white btn-sm mb-3 py-2" style={{fontWeight:"200"}}
                  onClick={this.purchaseModelOpen}
                  >New Purchase Entry </Button>
                   </Form.Group>
                </Col>
                </Row>
                <ReactTable
                data={this.state.allPurchase}
               className='-striped -highlight'
                // className='-highlight'
                columns={columns}
                defaultSorted={[{ id: "created", desc: true }]}
                pageSize={10}
                showPageSizeOptions={false}
                showPageJump={false}
              />
              </div>
            </div>
          </div>
        </div>
        </BlockUi>  
        <Modal
            show={this.state.purchaseModal_basicInfo}
            size={"lg"}
            onHide={this.handleClosePuchaseModel}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Purchase Details Enter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="div" blocking={this.state.loading2}  className="block-overlay-dark"  loader={<Spinner/>}>
            <div className="card">
                <div className="card-body">
                <AvForm onValidSubmit={this.handleSubmit}>
                <h3 className="text-dark d-flex justify-content-center">Purchase Details</h3>
                    <Row>
                          <Col md={6}>
                          <AvField name="companyName" label="Company Name" placeholder="Company Name"
                            onChange={ this.onChangeCmpName}
                            validate={{
                              required: {
                                  value: true,
                                  errorMessage: 'This field is required.'
                              },
                              // maxLength: {
                              //   value: 10,
                              //   errorMessage: 'Invalid phone number'
                              // },
                              // minLength: {
                              //   value: 10,
                              //   errorMessage: 'Invalid phone number'
                              // },
                              // pattern: {
                              //   value:/^[0-9]+$/,
                              //   errorMessage: `Invalid phone number.`
                              // }
                            }} 
                        />
                    </Col>
                    <Col md={6}>
                    <AvField name="companyAdress" label="Company Adress" placeholder="Company Adress"
                        onChange={ this.onChangeCmpAdd}
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                        },
                        // minLength: {
                        //   value: 4,
                        //   errorMessage: 'Invalid Purchase name.'
                        // },
                        // maxLength: {
                        //   value: 35,
                        //   errorMessage: 'Invalid Purchase name.'
                        // },
                        // pattern: {
                        //   value:  /^[a-zA-Z][a-zA-Z\s]*$/,
                        //   errorMessage: `Invalid Purchase name.`
                        // }
                    }} 
                    />
                     </Col>
                     </Row>
                     <Row>
                     <Col>
                      <AvField name="vehicleNumber" label="Vehicle Number" placeholder="Vehicle Number" 
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          }
                        }} 
                      />
                     </Col>
                     <Col>
                      <AvField name="kantaName" label="Kanta Name" placeholder="Kanta Name" 
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          }
                        }} 
                      />
                     </Col>
                     <Col>
                      <AvField name="kantaNo" label="Kanta Number" placeholder="DHR3123" 
                          validate={{
                          required: {
                              value: true,
                              errorMessage: 'This field is required.'
                          }
                      }} />
                     </Col>
                     </Row>
                     <Row>
                     <Col>
                      <AvField name="grossWeight" label="Gross Weight(Kg)" placeholder="Weight" 
                        onChange={(e)=>
                          //console.log("eeee", e.target.value)
                          this.setState({
                          grossWeight: e.target.value
                        })
                      }
                          validate={{
                          required: {
                              value: true,
                              errorMessage: 'This field is required.'
                          }
                      }} />
                     </Col>
                     <Col>
                      <AvField name="tareWeight" label="Tare Weight(Kg)" placeholder="Weight"
                        onChange={(e)=>this.setState({
                          tareWeight: e.target.value
                        })} 
                          validate={{
                          required: {
                              value: true,
                              errorMessage: 'This field is required.'
                          }
                      }} />
                     </Col>
                     <Col>
                      <AvField name="netWeight" label="Net Weight(Kg)" placeholder="Weight"
                          value={parseFloat(this.state.grossWeight)- parseFloat(this.state.tareWeight)} 
                          disabled={true}
                          validate={{
                          required: {
                              value: true,
                              errorMessage: 'This field is required.'
                          }
                      }} />
                     </Col>
                     </Row>
                     <Row>
                     <Col>
                      <AvField name="materialName" label="Material Name" placeholder="Material Name" 
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          }
                        }} 
                      />
                     </Col>
                     <Col>
                      <AvField name="recieverId"  type='select' label="Reciever Name" placeholder="Reciever Name"
                        onChange={this.onChangeReciever} 
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                          }
                        }} 
                      >
                        <option value='' key='recieverKey'>select Reciever </option>
                        {this.state.allReciever.map((data, index)=> <option value={data._id} key ={`${index}_reciever`}>{data.recieverName}</option>)}
                        <option value='create_new'key={'create_new'}>New Reciever </option>
                      </AvField>
                     </Col>
                     </Row>
                     <Row>
                      <Col md={4}>
                      <label >Product code</label>
                        <CreatableSelect 
                        value={this.state.newProductCode}
                        isClearable 
                        placeholder="Product code"
                        onChange={this.onChnageProductCode}
                        options={this.state.allProductCode} 
                        />
                      </Col>
                      <Col md={2} >
                      <div> <label >&nbsp;</label></div>
                        <button type="button" className="btn btn-gradient-primary btn-sm" onClick={this.uniqueProductCodeGen}>Auto Genrate</button>
                      </Col>
                     </Row>
                     <Row>
                        <Col md={3}>
                          <div>
                            <label >Loading Date</label>
                          </div>
                          <DatePicker
                              selected={new Date(loadingDateTime.date)}
                              onChange={(date) => this.handleDate(date, 'date', 'loading')}
                              //showTimeSelect
                              //showTimeSelectOnly
                              //timeIntervals={30}
                              //timeCaption="Time"
                              dateFormat="dd/MM/yyyy"
                          />
                        </Col>
                        <Col md={3}>
                          <div>
                            <label >Start Time</label>
                          </div>
                          <DatePicker
                              selected={new Date(loadingDateTime.startTime)}
                              onChange={(startTime) => this.handleDate(startTime, 'startTime', 'loading')}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                          />
                        </Col>
                        <Col md={3}>
                          <div>
                            <label >End Time</label>
                          </div>
                          <DatePicker
                              selected={new Date(loadingDateTime.endTime)}
                              onChange={(endTime) => this.handleDate(endTime, 'endTime','loading')}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                          />
                        </Col>
                        <Col md={3}>
                        <AvField name="unloadTime"  label ="Load Time" placeholder="00:00"
                            disabled={true}
                            value={convertMilliSecToHrMints(this.state.loadingRowTime)}
                        />
                        </Col>
                     </Row>             
                     {this.state.loadingWorkerList.map((data, indexNum)=>
                        <Row>
                        <Col md={4}>
                         <AvField name={`loadingWorker[${indexNum}].userId`} type='select' label="Unloaded By" placeholder="Unloaded By"  key={`${indexNum}workerId`}
                           value={data.workerId}
                           onChange={ this.updateWorkerField(indexNum, 'loading') }
                           validate={{
                           required: {
                               value: true,
                               errorMessage: 'This field is required.'
                             }
                           }} 
                         >
                           <option value='' key='workerKey'>Select Worker</option>
                           {this.state.allWorker.map((data, index)=> <option value={data.userInfo && data.userInfo.userId} key={`${index}_workerkey`}>{data.userInfo && data.userInfo.fullName}</option>)}
                           </AvField>
                        </Col>
                        <Col md={1} style={{paddingLeft:'3px',paddingRight:'3px'}} >
                          <Form.Group>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <button type="button" key={`${indexNum}_remove`}className="btn btn-gradient-danger btn-sm" onClick={()=>this.removeRow(indexNum, 'loading')}>
                            Remove 
                        </button>
                        </Form.Group>
                      </Col>
                       </Row>
                     )}
                      <div className="d-flex mb-3">
                        <button type="button" className="btn btn-gradient-primary btn-sm" onClick={()=>this.addMoreWoker('loading')}>
                          Add More worker for loading
                        </button>
                    </div>
                     <Row>
                        <Col md={3}>
                          <div>
                            <label >Unloading Date</label>
                          </div>
                          <DatePicker
                              selected={new Date(unLoadingDateTime.date)}
                              onChange={(date) => this.handleDate(date, 'date', 'unLoading')}
                              //showTimeSelect
                              //showTimeSelectOnly
                              //timeIntervals={30}
                              //timeCaption="Time"
                              dateFormat="dd/MM/yyyy"
                          />
                        </Col>
                        <Col md={3}>
                          <div>
                            <label >Start Time</label>
                          </div>
                          <DatePicker
                              selected={new Date(unLoadingDateTime.startTime)}
                              onChange={(startTime) => this.handleDate(startTime, 'startTime', 'unLoading')}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                          />
                        </Col>
                        <Col md={3}>
                          <div>
                            <label >End Time</label>
                          </div>
                          <DatePicker
                              selected={new Date(unLoadingDateTime.endTime)}
                              onChange={(endTime) => this.handleDate(endTime, 'endTime','unLoading')}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={30}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                          />
                        </Col>
                        <Col md={3}>
                        <AvField name="unloadTime"  label ="Unload Time" placeholder="00:00"
                            disabled={true}
                            value={convertMilliSecToHrMints(this.state.unLoadingRowTime)}
                        />
                        </Col>
                     </Row>
                     {this.state.unLoadingWorkerList.map((data, indexNum)=>
                        <Row>
                        <Col md={4}>
                         <AvField name={`unLoadingWorker[${indexNum}].userId`} type='select' label="Unloaded By" placeholder="Unloaded By"  key={`${indexNum}workerId`}
                           value={data.workerId}
                           onChange={ this.updateWorkerField(indexNum, 'unLoading') }
                           validate={{
                           required: {
                               value: true,
                               errorMessage: 'This field is required.'
                             }
                           }} 
                         >
                           <option value='' key='workerKey'>Select Worker</option>
                           {this.state.allWorker.map((data, index)=> <option value={data.userInfo && data.userInfo.userId} key={`${index}_workerkey`}>{data.userInfo && data.userInfo.fullName}</option>)}
                           </AvField>
                        </Col>
                        <Col md={1} style={{paddingLeft:'3px',paddingRight:'3px'}} >
                          <Form.Group>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <button type="button" key={`${indexNum}_remove`}className="btn btn-gradient-danger btn-sm" onClick={()=>this.removeRow(indexNum, 'unLoading')}>
                            Remove 
                        </button>
                        </Form.Group>
                      </Col>
                       </Row>
                     )}
                      <div className="d-flex mb-3">
                        <button type="button" className="btn btn-gradient-primary btn-sm" onClick={()=>this.addMoreWoker('unLoading')}>
                          Add More worker for unloading
                        </button>
                    </div>
                    <Row>
                        <div className="col-md-6 d-flex justify-content-end">
                        <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-md-6">
                        <Button variant="dark" 
                        onClick={this.handleClosePuchaseModel}
                         >Cancel</Button>
                        </div>
                    </Row>
                  </AvForm>
                </div>
              </div>
              </BlockUi>
            </Modal.Body>
          </Modal>  
          
          <Modal
            show={this.state.purchaseModal_image}
            size={"lg"}
            onHide={this.handleClosePuchaseModel}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Purchaser Image Upload</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="div" blocking={this.state.loading2}  className="block-overlay-dark"  loader={<Spinner/>}>
            <div className="card">
                <div className="card-body">
                    <Row>
                      <Col>
                            <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                              <Card.Body>
                                {/* <Card.Title>Card Title</Card.Title> */}
                                <Card.Title>
                                  <Button variant="success" onClick={this.capture}>Capture Photo </Button>
                                </Card.Title>
                              <Card.Img variant="top" src={this.state.imageSrc?this.state.imageSrc:"./blank_image.jpg"}  width={50} height={100} />
                              </Card.Body>
                            </Card>
                              <Webcam
                                audio={false}
                                ref={this.webcam_ref}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                minScreenshotWidth={180}
                                minScreenshotHeight={180}
                              />
                      </Col>
                      <Col>
                      <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                            <Card.Body>
                              {/* <Card.Title>Card Title</Card.Title> */}
                              <Card.Title>
                                <input type="file" hidden ref={this.front_ref} 
                                  //onChange={this.fileUploadInputChange}
                                onChange={this.fileSelect('vehicle_front_image')}
                                accept="image/*"
                                capture
                                 />  
                                <Button variant="success"
                                onClick={()=>this.fileUploadAction(`front`)}
                                >Upload Front Image </Button>
                              </Card.Title>
                            <Card.Img variant="top" src={purchaseImageUpload.vehicle_front_image_preview? purchaseImageUpload.vehicle_front_image_preview:"./blank_image.jpg"}  width={50} height={100} />
                            </Card.Body>
                          </Card>
                     </Col>
                     <Col>
                       <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                            <Card.Body>
                              <Card.Title>
                                <input type="file" hidden ref={this.back_ref} 
                                onChange={this.fileSelect('vehicle_back_image')}
                                accept="image/*"
                                capture="user"
                                 />  
                                <Button variant="success"
                                onClick={()=>this.fileUploadAction(`back`)}
                                >Upload Back Image </Button>
                              </Card.Title>
                            <Card.Img variant="top" src={purchaseImageUpload.vehicle_back_image_preview? purchaseImageUpload.vehicle_back_image_preview:"./blank_image.jpg"}  width={50} height={100} />
                            </Card.Body>
                          </Card>
                     </Col>
                     <Col>
                          <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                            <Card.Body>
                              {/* <Card.Title>Card Title</Card.Title> */}
                              <Card.Title>
                                <Button variant="success">Upload Left Image </Button>
                              </Card.Title>
                            <Card.Img variant="top" src="./blank_image.jpg"  width={50} height={100} />
                            </Card.Body>
                          </Card>
                     </Col>
                     <Col>
                          <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                            <Card.Body>
                              {/* <Card.Title>Card Title</Card.Title> */}
                              <Card.Title>
                                <Button variant="success">Upload Right Image </Button>
                              </Card.Title>
                            <Card.Img variant="top" src="./blank_image.jpg"  width={50} height={100}/>
                            </Card.Body>
                          </Card>
                     </Col>
                     <Col>
                          <Card style={{ width: '15rem', backgroundColor:"#090a11cc"}}>
                            <Card.Body>
                              {/* <Card.Title>Card Title</Card.Title> */}
                              <Card.Title>
                                <Button variant="success">Upload kanta slip </Button>
                              </Card.Title>
                            <Card.Img variant="top" src="./blank_image.jpg"  width={50} height={100}/>
                            </Card.Body>
                          </Card>
                     </Col>
                    </Row>
                    <Row className="mt-2">
                        <div className="col-md-6 d-flex justify-content-end">
                        <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-md-6">
                        <Button variant="dark" 
                        onClick={this.handleClosePuchaseModel}
                         >Cancel</Button>
                        </div>
                    </Row>
                </div>
              </div>
              </BlockUi>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.purchaseModal_product}
            size={"lg"}
            onHide={this.handleClosePuchaseModel}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add new products {this.state.selectedProductCode && `[Product Code: ${this.state.selectedProductCode.productCode}]`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="div" blocking={this.state.loading2} className="block-overlay-dark"  loader={<Spinner/>}>
            <div className="card">
                <div className="card-body">
                <Form>
                      <Form.Check 
                        type="switch"
                        id='sizeRequired'
                        label={this.state.freeSize===true?'Free Size':'Size Required'}
                        checked={this.state.freeSize}
                        onChange={this.handleRequiredSize}
                      />
                    </Form>
                <AvForm onValidSubmit={this.handleSubmit}>
                    <h3 className="text-dark d-flex justify-content-center p-3">Product Details</h3>
                    {this.state.purchaseProductList.map((data,numIndex)=>
                      <>
                      <Row >
                        <Col md={2} style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField type='select' name= {`purchaseProduct[${numIndex}].productNameId`} label ="Select Product Name" className="mt-1"
                          validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            }
                        }} 
                        >
                        <option value=''>Select Product </option>
                        {this.state.allProductName.length>0 && this.state.allProductName.map((data, index)=> {return (<option key={`${index}_prodname`} value={data._id} style={{color:"black"}}>{data.productName}</option>)} )}
                        <option key={'new_create'} value={'new_create'}> New Product Create</option>
                        </AvField>  
                      </Col>
                      <Col  style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField name= {`purchaseProduct[${numIndex}].qty`}  label ="Qty" placeholder="Qty"
                           type='number'
                           value={data.qty}
                           onChange={this.updateProductField(numIndex,'qty' )}
                           onKeyUp={  e => this.calculateField(e, numIndex) }
                          min={0}
                          max={400}
                          validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            },
                        }} 
                        />
                      </Col>
                      <Col md={1} style={{paddingLeft:'3px',paddingRight:'3px'}} >
                          <AvField 
                            type="select" name={`purchaseProduct[${numIndex}].unit`} label="Unit" 
                            value={data.unit}
                            onChange={this.updateProductField(numIndex,'unit')}
                              validate={{
                              required: {
                                  value: true,
                                  errorMessage: 'This field is required.'
                              }
                          }} >
                          <option value=''>Choose unit</option>
                          {unitOption.map((data, ind)=> {return (<option key={ind} style={{color:"black"}}>{data.label}</option>)} )}
                          </AvField>
                      </Col>
                      <Col style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField name= {`purchaseProduct[${numIndex}].length`}  label ="Length" placeholder="00" key={`${numIndex}_length `}
                        value={data.length}
                        onChange={this.updateProductField(numIndex,'length' )}
                          min={0}
                          max={200}
                          disabled={freeSize}
                          validate={{
                            required: {
                                value: !freeSize,
                                errorMessage: 'This field is required.'
                            }, 
                            pattern: {
                              value:/^[0-9]+.+$/,
                              errorMessage: `Invalid length number.`
                            }
                        }} 
                        />
                      </Col>
                      <Col style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField name= {`purchaseProduct[${numIndex}].breadth`}  label ="Breadth" placeholder="00" key={`${numIndex}_breadth`}
                        value={data.breadth}
                        onChange={this.updateProductField(numIndex,'breadth' )}
                          min={0}
                          max={200}
                          disabled={freeSize}
                          validate={{
                            required: {
                                value: !freeSize,
                                errorMessage: 'This field is required.'
                            }, 
                            pattern: {
                              value:/^[0-9]+.+$/,
                              errorMessage: `Invalid breadth number.`
                            }
                        }} 
                        />
                      </Col>
                      <Col style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField name= {`purchaseProduct[${numIndex}].height`}  label ="Height" placeholder="00" key={`${numIndex}_height`}
                        value={data.height}
                        onChange={this.updateProductField(numIndex,'height' )}
                          min={0}
                          max={200}
                          disabled={freeSize}
                          validate={{
                            required: {
                                value: !freeSize,
                                errorMessage: 'This field is required.'
                            }, 
                            pattern: {
                              value:/^[0-9]+.+$/,
                              errorMessage: `Invalid height number.`
                            }
                        }} 
                        />
                      </Col>
                      <Col  style={{paddingLeft:'3px',paddingRight:'3px'}}>
                        <AvField name= {`purchaseProduct[${numIndex}].perUnitWeight`}  label ="Per Unit Weight" placeholder="00" key={`${numIndex}_Unit/Weight`}
                        value={data.perUnitWeight}
                        onChange={this.updateProductField(numIndex,'perUnitWeight' )}
                        onKeyUp={  e => this.calculateField(e, numIndex) }
                        min={0}
                        disabled={freeSize}
                        // max={20}
                        validate={{
                          required: {
                              value: !freeSize,
                              errorMessage: 'This field is required.'
                          },
                          pattern: {
                            value:/^[0-9]+.+$/,
                            errorMessage: `Invalid number.`
                          }
                        }} 
                        />
                      </Col>
                      <Col style={{paddingLeft:'3px',paddingRight:'3px'}}>
                          <AvField type="text" name={`purchaseProduct[${numIndex}].rowWeight`} label="Total Weight" key={`${numIndex}_rowWeight`}
                              value={data.rowWeight} 
                              disabled={true}
                              validate={{
                              required: {
                                  value: true,
                                  errorMessage: 'This field is required.'
                              }
                          }} />
                      </Col>
                      <Col md={1} style={{paddingLeft:'3px',paddingRight:'3px'}} >
                          <Form.Group>
                            <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                            <button type="button" key={`remove_${numIndex}`}className="btn btn-gradient-danger btn-sm" onClick={()=>this.removeRowProduct(numIndex)}>
                            Remove 
                        </button>
                        </Form.Group>
                      </Col>
                    </Row>
                      </>
                    )}
                      <div className="d-flex mb-3">
                        <button type="button" className="btn btn-gradient-primary btn-sm" onClick={this.addMoreRowPurchaseProduct}>
                          Add More
                        </button>
                    </div>
                    {/* <Row>
                      <Col md={3}>
                        <AvField name="totalWeight"  label ="Total Weight" placeholder="Total Weight"
                        value={this.state.totalWeight}
                          validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            },
                            pattern: {
                              value:/^[0-9]+.+$/,
                              errorMessage: `Invalid Weight number.`
                            }
                        }} 
                        />
                      </Col>
                       
                      <Col md={3}>
                        <AvField name="short"  label ="Short" placeholder="short"
                        />
                      </Col>
                      <Col md={3}>
                        <AvField name="Actual"  label ="Actual" placeholder="Actual"
                         value={this.state.totalWeight}
                          validate={{
                            required: {
                                value: true,
                                errorMessage: 'This field is required.'
                            },
                            pattern: {
                              value:/^[0-9]+.+$/,
                              errorMessage: `Invalid Amount number.`
                            }
                        }} 
                        />
                      </Col>
                  
                    </Row> */}
                    <Row className="mt-3">
                        <div className="col-md-6 d-flex justify-content-end">
                        <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-md-6">
                        <Button variant="dark" 
                        onClick={this.handleClosePuchaseModel}
                         >Cancel</Button>
                        </div>
                    </Row>
                  </AvForm>
                </div>
              </div>
              </BlockUi>
            </Modal.Body>
          </Modal>
        
          <Modal
            show={this.state.deletePurchaseModal}
            // size={"lg"}
            onHide={this.handleCloseDeleteModel}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete Purchase Detail</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Are you want sure delete this purchase detail?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.handleCloseDeleteModel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={this.deleteHandle}>Delete</Button>
            </Modal.Footer>
          </Modal>

          {/* Purchaser order details */}
          <Modal
            show={this.state.showProductModal}
            // size={"lg"}
            onHide={this.showProductClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Product Detail Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ReactTable
                data={this.state.selectedCell && this.state.selectedCell.purchaseProduct && this.state.selectedCell.purchaseProduct.length>0?this.state.selectedCell.purchaseProduct:[]}
                className='-striped -highlight'
                // className='-highlight'
                columns={productColumn}
                defaultSorted={[{ id: "created", desc: true }]}
                pageSize={10}
                showPageSizeOptions={false}
                showPageJump={false}
              />
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.recieverModel}
            //size={"sm"}
            onHide={this.handleCloseRecieverModel}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Reciever</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="div" blocking={this.state.loading4}  className="block-overlay-dark"  loader={<Spinner/>}>
            <div className="card">
                <div className="card-body">
                <AvForm onValidSubmit={this.addNewReciever}>
                {/* <h3 className="text-dark d-flex justify-content-center">Purchase Details</h3> */}
                    {/* <Row> */}
                      
                    <Col >
                    <AvField name="recieverName" label="Reciever Name" placeholder="Reciever Name"
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                        },
                        minLength: {
                          value: 4,
                          errorMessage: 'Invalid Reciever name.'
                        },
                        maxLength: {
                          value: 35,
                          errorMessage: 'Invalid Reciever name.'
                        },
                        pattern: {
                          value:  /^[a-zA-Z][a-zA-Z\s]*$/,
                          errorMessage: `Invalid Reciever name.`
                        }
                    }} 
                    />
                     </Col>
                     <Col >
                          <AvField name="phoneNumber" label="Phone Number" placeholder="Phone Number"
                            validate={{
                              required: {
                                  value: true,
                                  errorMessage: 'This field is required.'
                              },
                              maxLength: {
                                value: 10,
                                errorMessage: 'Invalid phone number'
                              },
                              minLength: {
                                value: 10,
                                errorMessage: 'Invalid phone number'
                              },
                              pattern: {
                                value:/^[0-9]+$/,
                                errorMessage: `Invalid phone number.`
                              }
                            }} 
                        />
                    </Col>
                    {/* </Row> */}
                    <Row>
                        <div className="col-md-6 d-flex justify-content-end">
                        <Button type="submit">Submit</Button>
                        </div>
                        <div className="col-md-6">
                        <Button variant="dark" 
                        onClick={this.handleCloseRecieverModel}
                         >Cancel</Button>
                        </div>
                    </Row>
                  </AvForm>
                </div>
              </div>
              </BlockUi>
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.productNameModel}
            // size={"sm"}
            onHide={this.productNameModelClose}
            aria-labelledby="contained-modal-title-vcenter"
            animation="true"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Product Name</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <BlockUi tag="div" blocking={this.state.loading2}  className="block-overlay-dark"  loader={<Spinner/>}>
            <div className="card">
                <div className="card-body">
                <AvForm onValidSubmit={this.submitNewProductName}>
                    <Row>
                    <Col>
                    <AvField name="productName" label="Add Product Name" placeholder="Add Product Name"
                        validate={{
                        required: {
                            value: true,
                            errorMessage: 'This field is required.'
                        },
                        // minLength: {
                        //   value: 2,
                        //   errorMessage: 'This field is required'
                        // },
                        maxLength: {
                          value: 35,
                          errorMessage: 'This field is required'
                        },
                        // pattern: {
                        //   value:  /^[a-zA-Z][a-zA-Z\s]*$/,
                        //   errorMessage: `Invalid Purchase name.`
                        // }
                    }} 
                    />
                     </Col>
                     </Row>
                     <Row>
                     <Col>
                        <div className="d-flex justify-content-center">
                          <Button variant="dark" className="d-flex justify-content-center mt-3" onClick={this.productNameModelClose} >Cancel</Button>
                        </div>
                     </Col>
                     <Col>
                        <div className="d-flex justify-content-center">
                          <Button type="submit" className="d-flex justify-content-center mt-3" >Submit</Button>
                        </div>
                     </Col>
                    </Row>
                  </AvForm>
                </div>
              </div>
              </BlockUi>
            </Modal.Body>
          </Modal>

      <Modal show={this.state.captureImage} onHide={this.hideCaptureImage}  size="xl">
        <Modal.Header closeButton>Purchase Image </Modal.Header>
        <BlockUi tag="div" blocking={this.state.loading2}  className="block-overlay-dark"  loader={<Spinner/>}>
        <Modal.Body>
        {['front','back','left', 'right', 'slip'].map(docType=> <>
        <Card>
          <Card.Title>{docType!==`slip`? `Vehicle ${docType} Photo`: `Kanta ${docType} Photo`}</Card.Title> 
          {!this.state[`imageSrc${docType}`] && this.state[`readyTocapture${docType}`]?
            <Webcam 
            audio={false}
            ref={this[`${docType}_ref`]}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            // minScreenshotWidth={`100%`}
            // minScreenshotHeight={`100%`}
            />
            :
            <img  alt={docType} src={this.state[`imageSrc${docType}`]?this.state[`imageSrc${docType}`]: "./blank_image.jpg"} />
          }
            <Row>
              <Col>
                <div className="d-flex justify-content-center">
                  <Button variant="success" onClick={()=>!this.state[`readyTocapture${docType}`] && this.state[`imageSrc${docType}`]?this.reTake(docType):this.capture(docType)}>
                    {this.state[`imageSrc${docType}`]? `Retake` : this.state[`readyTocapture${docType}`] && !this.state[`imageSrc${docType}`]?`Capture`:`Click to take`} Photo 
                    </Button>
                </div>
              </Col>
              {this.state[`readyTocapture${docType}`] &&
                <Col>
                  <div className="d-flex justify-content-center">
                    <Button variant="success" onClick={this.flipCamera}>Flip camera </Button>
                  </div>
                </Col>
              }
            </Row>
        </Card>
        </>)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.hideCaptureImage}>Close</Button>
          <Button variant="primary"onClick={this.handleSubmitImage}>Upload</Button>
        </Modal.Footer>
        </BlockUi>
      </Modal>
        <Modal
          show={this.state.purchaseProductDeleteModalShow}
          // size={"lg"}
          onHide={this.purchaseProductDeleteModalClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Product Name Detail</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Are you want sure delete this product?
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={this.purchaseProductDeleteModalClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={this.deleteHandlePurchaseProduct}>Delete</Button>
          </Modal.Footer>
        </Modal>

        </div>
    )
  }
}

export default Purchase