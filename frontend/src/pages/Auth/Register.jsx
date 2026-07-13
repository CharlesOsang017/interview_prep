import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../components/Inputs/Input"
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector"
import { validateEmail } from "../../utils/helper"

const Register = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Handle Register Form Submit
  const handleRegister = async (e) => {
    e.preventDefault()

    if(!fullName){
      setError("Please enter your full name")
      return
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }

    if(!password){
      setError("Please enter a password")
      return
    }
    setError("")
    
    // Register API Call
    try {
      
    } catch (error) {
      if(error.repsonse && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("An error occurred. Please try again.")
      }
    }
  }
  return (
    <div className="w-[90vw] md:w-[33vw] p-5 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[4px] mb-3">
        Join us today by entering your details below.
      </p>
      <form onSubmit={handleRegister}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
          <Input
            value={fullName}
            label="Full Name"
            onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          type="text"
          error={error}
        />
        <Input
          value={email}
          label="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          type="email"
          error={error}
        />
        <Input
          value={password}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          error={error}
        />
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <button onClick={handleRegister} className="btn-primary text-center" type='submit'>
          REGISTER
        </button>
        <p className="text-[13px] text-slate-600 mt-3">
          Already have an account?{" "}
          <button className="font-medium text-primary underline cursor-pointer" onClick={() => {
            setCurrentPage("login")
          }}>Login</button>
        </p>
      </form>
    </div>
  )
}

export default Register