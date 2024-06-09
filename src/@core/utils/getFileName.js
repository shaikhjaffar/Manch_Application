function getFileName(filePath) {
    // Split the path by '\' to get individual parts
    var parts = filePath.split('\\');
    
    // The last part will be the filename
    var fileName = parts[parts.length - 1];
    
    return fileName;
}

export default getFileName
