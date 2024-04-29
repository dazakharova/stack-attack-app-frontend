// Encode image for storing it on the client and in the database
function getBase64FromImageInput(inputElement) {
    return new Promise((resolve, reject) => {
        if (inputElement.files.length === 0) {
            resolve(''); // No file was selected
        } else {
            const file = inputElement.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result.replace("data:", "").replace(/^.+,/, "")
                resolve(base64String); // Resolve the promise with the base64 string
            };
            reader.onerror = function(error) {
                reject(error)
            };
            reader.readAsDataURL(file)
        }
    });
}

export { getBase64FromImageInput };