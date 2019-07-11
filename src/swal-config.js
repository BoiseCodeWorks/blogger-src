import Swal from "sweetalert2";

function toast({ title, text = '', type = 'success', timer = 2500 }) {
    return Swal.fire({
        title,
        text,
        type,
        timer,
        showConfirmButton: false,
        position: 'top-right',
        toast: true,
    })
}

/**
 * 
 * @param {import("axios").AxiosError} error 
 */
function toastError(error) {
    if (!error) { return toast({ title: "An uknown error occured", type: 'error' }) }
    let title = error.message || "An error occured"
    if (!error.isAxiosError || !error.response) { return toast({ title, type: 'error' }) }
    let data = error.response.data
    let text = data.message ? data.message : data.error ? data.error : error.message
    title = `${error.code} ${title}`
    toast({ title, text, type: "error" })
}

function confirm({ title, text, type, confirmButtonText = 'Ok', cancelButtonText = 'Cancel' }) {
    return Swal.fire({
        title,
        text,
        type,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        allowOutsideClick: false
    }).then(res => res.value)
}

export { toast, confirm, toastError }