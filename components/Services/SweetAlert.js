import React, { Fragment } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast } from 'react-toastify'
// import { InfoToast } from '../../views/engine/Constant'

const MySwal = withReactContent(Swal)

const SuccessAlert = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}

const ErrorAlert = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}

const InfoAlert = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        icon: 'info',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}

const ErrorDefaultAlert = (err) => {
    return MySwal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}

const InfoDefaultAlert = (err) => {
    return MySwal.fire({
        title: 'Info',
        text: err,
        icon: 'info',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}

const SuccessRedirectAlert = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        // (retData.rlink === '1') ? window.location.reload() : (window.location.href = retData.rlink)
    })
}

const CourseSuccessAlert = (retData) => {
    return MySwal.fire({
        title: 'Course Submitted',
        text: "Submitted for under review",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: "Course Preview",
        closeOnConfirm: false,
        closeOnCancel: false,
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-outline-primary ml-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            //alert('Submitted')
            window.location.href = retData.rlink
        } else {
            window.location.href = retData.plink
        }
    })
}
const CourseSuccessAlert2 = (retData) => {
    return MySwal.fire({
        title: 'Course Submitted',
        text: "Submitted",
        icon: 'success',
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'btn btn-success'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            //alert('Submitted')
            window.location.href = retData.rlink
        } else {
            window.location.href = retData.plink
        }
    })
}

const SuccessAlert2 = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        showConfirmButton: true,
        closeOnConfirm: false,
        icon: 'success',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    }).then(function () {
        window.location.reload()
    })
}
const ErrorAlert2 = (retData) => {
    return MySwal.fire({
        title: retData.title,
        text: retData.message,
        icon: 'error',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    }).then(function () {
        window.location.reload()
    })
}


export { SuccessAlert, ErrorAlert, InfoAlert, ErrorDefaultAlert, InfoDefaultAlert, SuccessRedirectAlert, CourseSuccessAlert, CourseSuccessAlert2, SuccessAlert2, ErrorAlert2 }