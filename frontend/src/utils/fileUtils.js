export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateAndFilterFiles = (selectedFiles, existingFiles = []) => {
  const validFiles = [];
  const oversizedFiles = [];

  Array.from(selectedFiles).forEach(file => {
    if (file.size > MAX_FILE_SIZE) {
      oversizedFiles.push(file.name);
    } else {
      validFiles.push(file);
    }
  });

  return {
    files: [...existingFiles, ...validFiles],
    oversizedFiles
  };
};
