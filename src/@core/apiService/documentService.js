// utils/auth.js
import axios from 'axios';
import { base_url } from '../utils/Constant';


  const getbatchNameBytemplate = async(templateName) =>{
      console.log(templateName);
    try {
        const response = await axios.post(`${base_url}/get-batchName-templateName`, {
            templateName
        });
    
        if (response.status === 200) {
          // Handle successful login
          // For example, save the token to local storage or cookies
          const { BatchName } = response.data;
        
    
          return { success: true, BatchName };
        } else {
          // Handle other statuses
          return { success: false, message: 'failed to fetch' };
        }
      } catch (error) {
        // Handle error
        console.error('error:', error);
        
    return { success: false, message: error.response?.data?.message || 'An error occurred. Please try again.' };
      }
  } 

  const PdfList = async(templateName,batchName) =>{
  try {
      const response = await axios.post(`${base_url}/get-pdf-list`, {
          templateName,batchName
      });
  
      if (response.status === 200) {
        // Handle successful login
        // For example, save the token to local storage or cookies
        const { pdfList } = response.data;
      
  
        return { success: true, pdfList };
      } else {
        // Handle other statuses
        return { success: false, message: 'failed to fetch' };
      }
    } catch (error) {
      // Handle error
      console.error('error:', error);
      
  return { success: false, message: error.response?.data?.message || 'An error occurred. Please try again.' };
    }
}
 

const generatePdfByConfig = async (request) => {
  try {
    const formData = new FormData();
    formData.append('csvfile', request.csvfile);
    formData.append('html', request.html);
    formData.append('batchName', request.batchName);
    formData.append('templateName', request.template_name.toLowerCase().replace(/\s+/g, '_'));

    const response = await axios.post(`${base_url}/generate-pdfs`, formData);

    return response;
  } catch (error) {
   
    return 'Failed to generate PDF. Please try again.';
  }
}

  export {
    getbatchNameBytemplate,
    PdfList,
    generatePdfByConfig
  }

