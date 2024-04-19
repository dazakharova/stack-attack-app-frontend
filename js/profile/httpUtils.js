const handleHttpResponseError = (response) => {
    if (response.status === 401) {
        alert('Your session has expired. Please log in again.')
    } else {
        alert('Something went wrong. Please try again.')
    }
    window.location.href = '/'
    return null
}

const processNetworkError = (error) => {
    // Handle network errors or errors in processing the request
    console.error('Network error or error in processing the request:', error)
    alert('An error occurred while fetching data. Please check your connection and try again.')
    window.location.href = '/'
    return null
}


export { handleHttpResponseError, processNetworkError }