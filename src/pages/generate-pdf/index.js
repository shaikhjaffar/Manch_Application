
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import { useState,useEffect } from 'react'
import getFileName from 'src/@core/utils/getFileName'
import { OutlinedInput } from '@mui/material'
import { base_url } from 'src/@core/utils/Constant'


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
    doctype:[{
      id:'',
      name:''
    }],
    templateName:[{
      id:'',
      name:''
    }],
    template_id:'',
    html:'',
    pdfPrefix:'',
    startIndex:null,
    smapleCsvUrl:''
  })
  const [documentData, setDocumentData] = useState(null);

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
 setrequest({...request,'html': html_String[0].template_html,'template_id':e.target.value,'smapleCsvUrl':html_String[0].sample_csv_url});
};

  const handleChangeFile = (e) =>{
     setfile({...file,filename:getFileName(e.target.value)})
    
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
    console.log(request)
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
  <InputLabel id="demo-simple-select-label">Enter Pdf file Prefix</InputLabel>
  <OutlinedInput
                label='Enter Pdf file Prefix'

                value={request.pdfPrefix}

                id='auth-login-identifier'

                onChange={(e)=>{setrequest({...request,'pdfPrefix':e.target.value})}}

                type='text'/>
</FormControl>

  </Grid>
  <Grid item xs={4}>
  <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Starting Index</InputLabel>
  <OutlinedInput
                label='Enter Pdf file Prefix'

                value={request.startIndex}

                id='auth-login-identifier'

                onChange={(e)=>{setrequest({...request,'startIndex':e.target.value})}}

                type='tel'/>
</FormControl>

  </Grid>
  </Grid>

  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>

  <Grid item xs={4} sx={{ marginTop: 4.8, marginBottom: 3 }}>
  <Button variant='outlined'>
    <a href={request.smapleCsvUrl} download>
    Download Sample Csv
    </a>
 
  </Button>
  </Grid>
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
