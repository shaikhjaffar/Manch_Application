
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { useState,useEffect } from 'react'
import getFileName from 'src/@core/utils/getFileName'
import { OutlinedInput } from '@mui/material'
import { base_url } from 'src/@core/utils/Constant'
import { generatePdfByConfig } from 'src/@core/apiService/documentService'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const downloadCsvFromBase64=(base64Csv, filename)=> {
  if(!filename || filename === ""){
    toast.error("Please Select templatename first",{position:'top-right'})

    return

  }


// Decode the base64 string
const csvContent = atob(base64Csv);

// Create a Blob from the CSV content
const blob = new Blob([csvContent], { type: 'text/csv' });

// Create a link element
const link = document.createElement('a');

// Set the href attribute to a URL representing the Blob object
link.href = URL.createObjectURL(blob);

// Set the download attribute with the specified filename
link.download = `${filename}_Sample`;

// Append the link to the document body
document.body.appendChild(link);

// Programmatically click the link to trigger the download
link.click();

// Remove the link from the document
document.body.removeChild(link);
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}));



const GeneratePdf = () => {
  const [request,setrequest] = useState ({
    templateName:[{
      id:'',
      name:''
    }],
    template_name:'',
    html:'',
    batchName:'',
    smapleCsvUrl:'',
  })
   const [loading,setLoading] = useState(false)
  const [documentData, setDocumentData] = useState(null);
  const router = useRouter()

 const [file,setfile] = useState({
  filename:'',
  filePath:''
 })

 

 const handleTemplateChange = (e) =>{
  const html_String = documentData.documnet.filter((ele)=>{
     
     if(ele.id === e.target.value ){
       return ele
     }
     
  })
   console.log(html_String)
 setrequest({...request,'html': html_String[0].template_html,'template_name':html_String[0].template_name,'smapleCsvUrl':html_String[0].sample_csv_url});
};

  const handleChangeFile = (e) =>{
     setfile({...file,filename:getFileName(e.target.value)})
     setrequest({...request,'csvfile':e.target.files[0]})
  }

  const extractDocumentDetails = (responseData) => {
    if (responseData && responseData.message === 'Success' && responseData.documnet) {
      // Extracting document details from the response
      const extractedDetails = responseData.documnet.map(doc => ({
        id: doc.id,
        documentTypeId: doc.document_type_id,
        documentTypeName: doc.document_type_name,
        templateName: doc.template_name,
      }));

      const doctype = extractedDetails.map(doc => ({
        id: doc.id,
        name: doc.documentTypeName
      }));

      const templateName = extractedDetails.map(doc => ({
        id: doc.id,
        name: doc.templateName
      }));

      // Update request state with extracted data
      setrequest(prevState => ({
        ...prevState,
        doctype,
        templateName,
      }));
    } else {
      console.error('Invalid API response:', responseData);
    }
  };

  const generatePdf =()=>{
       if(!request.batchName || !request.template_name || !request.csvfile ){
        toast.error("Batch Name,Template Name and Csv file required",{position:'top-right'})
        
           return
       } 
       setLoading(true)
       generatePdfByConfig(request)
       
       .then((data)=>{
          if(data.status == 200){
            toast.success("PDF Generated Successfully!",{position:'top-right'})
            setLoading(false)
            router.push('/download-pdf')
          }
       })
       .catch((err)=>{
        toast.error("PDF Generation Failed!",{position:'top-right'})
       })
  }


 useEffect(() => {
    // Function to fetch document details from API
    const fetchDocumentDetails = async () => {
      try {
        // Get token from local storage
        const token = localStorage.getItem('token');

        // If token exists, make API request with Authorization header
        if (token) {
          const response = await fetch(`${base_url}/getAllDocs`, {
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
            
          setDocumentData(data);
          extractDocumentDetails(data)
          console.log(data)
        } else {
          throw new Error('Access token not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching document details:', error);
      }
    };

    // Call fetchDocumentDetails function when component mounts
    fetchDocumentDetails();

    // Cleanup function (optional)
    return () => {
      // Cleanup logic, if needed
    };
  }, []);

  return (
    <Card sx={{padding:'1em',width:'max-content'}}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
       <CardContent>
       <form>
       <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  <Grid item xs={4}>
  <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Template Name</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    
    // value={age}

    label="Template Name"

    onChange={handleTemplateChange}
  >
    {
      request.templateName.map((ele)=>{

        return  <MenuItem value={ele.id} key={ele.id}>{ele.name}</MenuItem>
      })
    }
  </Select>
</FormControl>

  </Grid>
  <Grid item xs={4}>
  <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Enter Batch Name</InputLabel>
  <OutlinedInput
                label='Enter Pdf file Prefix'

                value={request.batchName}

                id='auth-login-identifier'

                onChange={(e)=>{setrequest({...request,'batchName':e.target.value})}}

                type='text'/>
</FormControl>

  </Grid>
  <Grid item xs={4}>
  <Button variant='outlined' onClick={()=>{downloadCsvFromBase64(request.smapleCsvUrl,request.template_name)}}>
    Download Sample Csv
  </Button>
  </Grid>
  </Grid>

  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

 
  <Grid item xs={4} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box>
                <ButtonStyled component='label'  variant='contained' htmlFor='account-settings-upload-image'>
                  Upload CSV
                  <input

                    hidden

                    type='file'
                    onChange={handleChangeFile}

                    accept='.csv'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <Typography variant='body1' sx={{ marginTop: 5 }}>
                   {file?.filename}
                </Typography>
              </Box>
            </Box>
          
          </Grid>
  <Grid item xs={4} sx={{ marginTop: 4.8, marginBottom: 3 }}>
  <Button  variant='outlined' onClick={generatePdf}>Generate PDF</Button>
  </Grid>
  

          </Grid>

       </form>
      
    </CardContent>
    </Card>
  )
}

export default GeneratePdf
