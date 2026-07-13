import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../../components/Inputs/Input"
import { validateEmail } from "../../utils/helper"

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault()

    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }

    if(!password){
      setError("Please enter a password")
      return
    }
    setError("")
    
    // Login API Call
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
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>
      <form onSubmit={handleLogin}>
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
        <button onClick={handleLogin} className="btn-primary text-center" type='submit'>
          LOGIN
        </button>
        <p className="text-[13px] text-slate-600 mt-3">
          Don't have an account?{" "}
          <button className="font-medium text-primary underline cursor-pointer" onClick={() => {
            setCurrentPage("register")
          }}>Register</button>
        </p>
      </form>
    </div>
  )
}

export default Login