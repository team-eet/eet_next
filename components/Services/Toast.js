import React, { Fragment } from 'react'

const SuccessProgressToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                {/*<Avatar size='sm' color='success' icon={<Check size={12} />} />*/}
                <h6 className='toast-title'>{props.pdata.message} </h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                {props.pdata.eorm}
            </span>
        </div>
    </Fragment>
)

const ErrorMessageToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                {/*<Avatar size='sm' color='danger' icon={<X size={12} />} />*/}
                <h6 className='toast-title'>{props.pdata.title}</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                {props.pdata.message}
            </span>
        </div>
    </Fragment>
)

const ErrorToast = () => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                {/*<Avatar size='sm' color='danger' icon={<X size={12} />} />*/}
                <h6 className='toast-title'>Unauthorize user</h6>
            </div>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                {props.pdata.message}
            </span>
        </div>
    </Fragment>
)

const InfoToast = () => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                {/*<Avatar size='sm' color='info' icon={<Info size={12} />} />*/}
                <h6 className='toast-title'>Info!</h6>
            </div>
            <small className='text-muted'>11 Min Ago</small>
        </div>
        <div className='toastify-body'>
            <span role='img' aria-label='toast-text'>
                👋 Jelly-o macaroon brownie tart ice cream croissant jelly-o apple pie.
        </span>
        </div>
    </Fragment>
)

export { SuccessProgressToast, InfoToast, ErrorToast, ErrorMessageToast }
// function Constant() {
//     return (
//         <>
//             <div className='toastify-header'>
//                 <div className='title-wrapper'>
//                     <Avatar size='sm' color='success' icon={<Check size={12} />} />
//                     <h6 className='toast-title'>Progress Bar!</h6>
//                 </div>
//                 <small className='text-muted'>11 Min Ago</small>
//             </div>
//             <div className='toastify-body'>
//                 <span role='img' aria-label='toast-text'>
//                     👋 Jelly-o macaroon brownie tart ice cream croissant jelly-o apple pie.
//             </span>
//             </div>
//         </>
//     )
// }
// export default Constant
