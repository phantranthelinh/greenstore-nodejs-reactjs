import React, {useEffect, useRef, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {toast} from "react-toastify"
import {updateUserProfile} from "../../Redux/Actions/UserActions"
import Message from "./../LoadingError/Error"
import Loading from "./../LoadingError/Loading"
import Toast from "./../LoadingError/Toast"

const ProfileTabs = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const ToastObjects = {
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHouver: false,
    autoClose: 2000,
    theme: "colored",
  }
  const toastId = useRef(null)
  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const {loading, error, user} = userDetails

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const {loading: updateLoading} = userUpdateProfile
  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [dispatch, user])
  const submitHandler = (e) => {
    e.preventDefault()
    //Password match

    if (password !== confirmPassword) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Password does not match", ToastObjects)
      }
    } else {
      dispatch(updateUserProfile({id: user._id, name, email, password}))
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("Updated successfully", ToastObjects)
      }
    }
  }
  return (
    <>
      <Toast />
      {error && <Message variant="alert-danger">{error}</Message>}
      {loading && <Loading />}
      {updateLoading && <Loading />}

      <form className="row  form-container" onSubmit={submitHandler}>
        <div className="col-md-6">
          <div className="form">
            <label for="account-fn">UserName</label>
            <input
              className="form-control"
              type="text"
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form">
            <label for="account-email">E-mail Address</label>
            <input
              className="form-control"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              defaultValue={email}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-pass">New Password</label>
            <input
              className="form-control"
              type="password"
              defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form">
            <label for="account-confirm-pass">Confirm Password</label>
            <input
              className="form-control"
              type="password"
              defaultValue={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </>
  )
}

export default ProfileTabs
