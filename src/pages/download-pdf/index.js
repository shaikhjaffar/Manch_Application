import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Select from '@mui/material/Select'
import { Button, CardContent,FormControl, InputLabel, MenuItem, } from '@mui/material'
import { base_url } from 'src/@core/utils/Constant'
import { PdfList, documentService, getbatchNameBytemplate } from 'src/@core/apiService/documentService'
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {ButtonGroup, LinearProgress, Tooltip ,InputAdornment, OutlinedInput, Drawer, Box} from "@mui/material";
import MUIDataTable ,{TableFilterList} from "mui-datatables";
import Chip from '@mui/material/Chip';
import { Download, SearchOutlined } from "@mui/icons-material";
import axios from "axios";

const DownloadPdf = () => {
 const [templateName,setTemplateName]=useState([])
const [batchName,setBatchName] = useState([])
const [tabledata,setTabledata] = useState([])

 const [request,setrequest] = useState({
  templateName:"",
  batchName:""
 })

 const handleTemplateChange = async(e) => {
   console.log(e.target.value)
  setrequest({...request,templateName:e.target.value})
   const newbatchName = await getbatchNameBytemplate(e.target.value)
     setBatchName(newbatchName.BatchName);
 }

 const  showPdffile = async()=>{
    console.log(request)
    const list = await PdfList(request.templateName,request.batchName)
      setTabledata(list.pdfList)
      console.log(list)
 }

  useEffect(() => {
    const fetchDocumentDetails = async () => {

      try {
        // Get token from local storage
        const token = localStorage.getItem('token');
    
        // If token exists, make API request with Authorization header
        
        if (token) {
          const response = await fetch(`${base_url}/getAllTemplate`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch document details');
          }
    
          // Parse response JSON
          const data = await response.json();
    
          // Update state with fetched document data
            
          setTemplateName(data.TemplateList);
          console.log(data.TemplateList)
        } else {
          throw new Error('Access token not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching document details:', error);
      }
    };
    fetchDocumentDetails();

    return () => {
      // Cleanup logic, if needed
    };
  }, []);
  
  return (
    <Card sx={{padding:'1em'}}>
    <CardContent>
    <Grid container rowSpacing={2} sx={{placeItems:"center"}} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
<Grid item xs={4}>
<FormControl fullWidth>
<InputLabel id="template-label">Template Name</InputLabel>
<Select
 labelId="template-label"
 id="template"

 value={request.templateName}

 label="Template Name"

 onChange={handleTemplateChange}
>
 {
   templateName.map((ele,Index)=>{

     return  <MenuItem value={ele.table_name} key={Index}>{ele.table_name}</MenuItem>
   })
 }
</Select>
</FormControl>

</Grid>
<Grid item xs={4}>
<FormControl fullWidth>
<InputLabel id="batchName-label">Batch Name</InputLabel>
<Select
 labelId="batchName-label"
 id="batchName"

 value={request.batchName}
  disabled = {request.templateName ? false : true}
 label="Batch Name"

 onChange={(e)=>{
     setrequest({...request,batchName:e.target.value})
 }}
>
 {
   batchName?.map((ele,Index)=>{

     return  <MenuItem value={ele.batchName} key={Index}>{ele.batchName}</MenuItem>
   })
 }
</Select>
</FormControl>

</Grid>
<Grid item xs={4}>
<Button  variant='outlined' onClick={showPdffile}>Show PDF</Button>
</Grid>
</Grid>

   
 </CardContent>

 <CardContent>
  <Templates data={tabledata} request={request} />
 </CardContent>
 </Card>
  
  )
}

export default DownloadPdf




export  function Templates({data,request}) {
  const [loading, setLoading] = useState(false);

  const [src,setsrc] = useState("");
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  



//   const handleEdit = (id) => {
//     navigate("/app/edit-template", {
//       state:  {templateData : data[id.rowIndex]} 
//       })
//   };


//   function downloadCSVFromBase64(base64String, fileName) {
//     // Decode the base64 string
//     const decodedData = atob(base64String);

//     // Convert the decoded data to a byte array
//     const byteNumbers = new Array(decodedData.length);
//     for (let i = 0; i < decodedData.length; i++) {
//         byteNumbers[i] = decodedData.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
// }

// function base64PdfToUrl(base64String){
//   const binaryString = atob(base64String);

//   // Create an array buffer to hold the binary string
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//   }

//   // Create a blob from the bytes
//   const blob = new Blob([bytes], { type: 'application/pdf' });

//     return URL.createObjectURL(blob)
     
// }

function downloadBase64Pdf(base64String, filename) {
      const url = base64String ;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append the link to the body (not visible to the user)
  document.body.appendChild(link);

  // Trigger the download by simulating a click
  link.click();

  // Clean up by removing the link and revoking the object URL
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

  const handleDownload = (id,tableMeta) =>{
         downloadBase64Pdf(id,`${request.templateName}_${request.batchName}_${data[tableMeta.rowIndex].pdfNumber}`)
  }

  const handlePreview = (tableMeta)=>{
     setsrc(data[tableMeta.rowIndex].base64Data)
     setOpen(true)

  }

  const columns = [
    { name: "pdfNumber", label: "PDF Name", width: 100,options:{    customHeadRender: (columnMeta) => {
      return (
        <th key={columnMeta.index} style={{padding:"16px",textAlign:"left",color:"rgba(0, 0, 0, 0.6)"}}>
          {columnMeta.label}
        </th>
      );
    },
    customBodyRender:(value)=>{
      return (
        <div>
        {`${request.batchName}_${value}`}
      </div>
      )
    }
  
  } 
  },
    
    {
      name: "base64Data",
      label: "Download",
      width: 100,
      textAlign: "center",
      options: { align: "center" ,
      customHeadRender: (columnMeta) => {
        return (
          <th key={columnMeta.index} style={{padding:"16px",textAlign:"center",color:"rgba(0, 0, 0, 0.6)"}}>
            {columnMeta.label}
          </th>
        );
      },
      customBodyRender: (value,updateValue) => {
        return (
          <div style={{ textAlign: "center" }}>
            <ButtonGroup style={{ alignContent: "center" }}>
              <Tooltip title="Download Notice">
                <Button
                  style={{
                    color: "rgb(0, 81, 134)",
                    border: "none",
                    cursor: "pointer",
                    width:"20px"
                  }}
                >
                  <Download onClick={() => handleDownload(value,updateValue)} sx={{width:"20px"}} />
                </Button>{" "}
              </Tooltip>
            </ButtonGroup>
          </div>
        );
      },
    
    },
    },
    {
      name: "id",
      label: "Preview",
      width: 150,
      options: {
        filter: true,
        customHeadRender: (columnMeta) => {
          return (
            <th key={columnMeta.index} style={{color:"rgba(0, 0, 0, 0.6)"}}>
              {columnMeta.label}
            </th>
          );
        },
        customBodyRender: (value,updateValue,columnMeta) => {
          return (
            <div style={{ textAlign: "center" }}>
              <ButtonGroup style={{ alignContent: "center" }}>
                <Tooltip title="View">
                  {" "}
                  <Button
                    style={{
                      color: "rgb(0, 81, 134)",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePreview(updateValue)}
                  >
                    <VisibilityIcon  sx={{width:"20px"}} />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </div>
          );
        },
      },
    },
    {
      name: "created_at",
      label: "Created On",
      width: 100,
      options:{
        customHeadRender: (columnMeta) => {
          return (
            <th key={columnMeta.index} style={{padding:"16px",textAlign:"center",color:"rgba(0, 0, 0, 0.6)"}}>
              { columnMeta.label}
            </th>
          );
        },
        customBodyRender:(value)=>{
          return (
            <div  style={{ textAlign: "center" }}>
            {new Date(value).toLocaleString()}
          </div>
          )
          
        }
      }
    },
  ];

  const options = {
    selectableRows: "none",
    customBodyRender: (value) => {
      return (
        <span
          style={{
            display: "block",
            textAlign: "center",
          }}
        >
          {value}
        </span>
      );
    },
  };

  const CustomChip = ({ label, onDelete }) => {

    return (
      
        <Chip
            variant="outlined"
            color="secondary"
            label={label}
            onDelete={onDelete}
        />
    );
};

  const CustomFilterList = (props) => {
    return <TableFilterList {...props} ItemComponent={CustomChip} />;
};


  return (
    <>
      <div className="navView"> 
        {loading ? (
          <LinearProgress />
        ) : ( 
          <MUIDataTable data={data} columns={columns} options={options} components={{
            TableFilterList: CustomFilterList,
          }} />
        )}
      </div>
      <Drawer open={open} sx={{zIndex:"1203"}} anchor='right' onClose={toggleDrawer(false)}>
      <Box sx={{width:"50vw",color:"#000"}}>
      <iframe style={{width:"100%",height:"100vh"}} src={src}  />
      </Box>
      </Drawer>
    </>
  );
}