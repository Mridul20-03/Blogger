import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";


const SignUp = () => {
  const navigate = useNavigate();
  const [formData , setFormData] = useState({});
  const [ errorMessage , setErrorMessage ] = useState(null);
  const [ loading , setLoading ] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData , [e.target.id]: e.target.value.trim() });
  }
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      if( !formData.username || !formData.password || !formData.email){
        return setErrorMessage('Please fill out all the fields');
      }


      try{

        setErrorMessage(null);
        setLoading(true);
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }); 
        const data  = await res.json();

        if(data.success === false){
          return setErrorMessage(data.message);
        }

        setLoading(false);

        if(res.ok){
          navigate('/sign-in');
        }
      }catch(err){
          setErrorMessage(err.message);
          setLoading(false);
      }

  } 
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6">
      
      
        {/* Left side */}
        <div className=" flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 rounded-lg text-white">
              Mridul's
            </span>
            Blog
          </Link>

          <p className="text-sm mt-6">
            This is my blog. You can sign up with your email and password or
            with Google.
          </p>
        </div>

        {/*   Right side */}
        <div className="flex-1">
          <form className="flex flex-col gap-4"
          onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id="username" onChange={handleChange}/>   
            </div>

            <div className="">
              <Label value="Your Email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange}/>   
            </div>

            <div className="">
              <Label value="Your Password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>   
            </div>

            <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                  </>
                ) : ' Sign Up'
              }
            </Button>
          </form>


          <div className="flex gap-3 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/sign-in' className="text-blue-600">Sign In</Link>
          </div>

        {
          errorMessage && (
            <Alert className="mt-5" color='failure'>
              {errorMessage}
            </Alert>
          )
        }


        </div>
      </div>
    </div>
  );
};

export default SignUp;
