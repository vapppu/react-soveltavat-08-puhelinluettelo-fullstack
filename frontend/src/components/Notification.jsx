const Notification = ({message}) => {

    if (message) {
        const errorClass = "notification ".concat(message.isError ? "failure" : "success")
    return (
        <div className={errorClass}>Notification: {message.text} {message.isError}</div>
    )
    }
}

export default Notification