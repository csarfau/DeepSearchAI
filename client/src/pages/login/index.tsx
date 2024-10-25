import { Box, Paper, TextField, Typography, Button, Switch, FormControlLabel, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGoogleLogin } from '@react-oauth/google';
import { createApiClient } from "../../api/fetch";
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import banner from "@/assets/icons/banner.svg";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import useToast from "../../hooks/useToast";
import logo from "@/assets/icons/logo.svg";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginPage = () => {
  const [registerErrors, setRegisterErrors] = useState({ registerEmail: '', registerPassword: '', confirmPassword: '' });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [googleLoginAttempted, setGoogleLoginAttempted] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFinishedRegister, setIsFinishedRegister] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [emailNotification, setEmailNotification] = useState(true);
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerChoice, setRegisterChoice] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { setToken, user } = useUser();
  const navigate = useNavigate();
  const showToast = useToast();
  const theme = useTheme();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowRegisterPassword = () => setShowRegisterPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailNotification(event.target.checked);
  };

  const handleToggle = () => {
    setRegisterChoice(!registerChoice);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setForgotEmail('');
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    console.log(forgotEmail);
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!forgotEmail) {
      setLoading(false);
      return showToast('E-mail is required!', 'error');
    }
    if(!emailRegex.test(forgotEmail)) {
      setLoading(false);
      return showToast('Provide a valid e-mail!', 'error');
    }

    try {
      const response = await nonAuthClient.sendForgotPasswordEmail(forgotEmail);
      if(response.error) {
        setLoading(false);
        return showToast(response.error, 'error');
      }
      handleCloseModal();
      return showToast('Recovery e-mail send!', 'success');
    } catch (error) {
      setLoading(false);
      return showToast(error as string, 'error');
    }
  };

  const clear = () => {
    setPassword('');
    setRegisterPassword('');
    setEmail('');
    setRegisterEmail('');
    setErrors({ email: '', password: '' });
    setRegisterErrors({ registerEmail: '', registerPassword: '', confirmPassword: '' });
  }

  useEffect(() => {
    clear();
  }, [registerChoice]);

  const validateLogin = () => {
    const newErrors = { email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'E-mail is required!';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Provide a valid e-mail!';
    }

    if (!password) {
      newErrors.password = 'Password is required!';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  }

  const validateRegister = () => {
    const newErrors = { registerEmail: '', registerPassword: '', confirmPassword: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registerEmail) {
      newErrors.registerEmail = 'E-mail is required!';
    } else if (!emailRegex.test(registerEmail)) {
      newErrors.registerEmail = 'Provide a valid e-mail!';
    }

    if (!registerPassword) {
      newErrors.registerPassword = 'Password is required!';
    } else if (registerPassword.length < 8) {
      newErrors.registerPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== registerPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setRegisterErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  }

  const nonAuthClient = createApiClient({ token: null, userId: null });

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const response = await nonAuthClient.login(email, password);
      
      if (response.error) return showToast(response.error, 'error');

        setToken(response.token as string);
        return navigate('/chat');
    } catch (error) {
      return showToast(error as string, 'error');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin();
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await nonAuthClient.userGoogleInfos(response.access_token);
        if (userInfo.error) return showToast("Google login failed. Please try again.", "error");

        const emptyPassword = '';
        const loginResponse = await nonAuthClient.login(userInfo.email as string, emptyPassword, userInfo.sub as string);
        if (loginResponse.error) return showToast("Google login failed. PLease try again.", "error");

        setToken(loginResponse.token as string);

        if (!user?.definedTheme) return navigate('/suggestions');

        navigate('/chat');
      } catch (error) {
        return showToast(error as string, 'error');
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      showToast('Google login failed. Please try again.', 'error');
    },
    flow: 'implicit',
    scope: 'profile email',
  });

  useEffect(() => {
    if (googleLoginAttempted) {
      handleGoogleLogin();
      setGoogleLoginAttempted(false);
    }
  }, [googleLoginAttempted, handleGoogleLogin]);

  const handleRegister = async () => {
    if (!validateRegister()) return;
    try {
      const response = await nonAuthClient.registerUser(registerEmail, registerPassword); 
      
      if (response.error) return showToast(response.error, 'error');

      setToken(response.data.token as string);
      setIsFinishedRegister(true);

      setTimeout(() => {
        navigate('/suggestions')
      }, 1000)
      
      setRegisterChoice(false);
      return showToast('Account created!', 'success');

    } catch (error) {
      return showToast(error as string, 'error');
    }
  };

  const handleRegisterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleRegister();
    }
  };

  return (
    <Box  sx={{
      width: '100%',
      px: { md: '2rem' },
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      <Paper elevation={2} sx={{
        minHeight: {xs:'100vh', md: '95vh'},
        width: {xs: '100%', md: '90%'},
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        background: theme.palette.secondary.main,
        alignItems: 'center',
        border: theme.borders.secondary,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 1s ease-in-out',
        ...(isFinishedRegister && {transform: 'translateX(-200%)'})
      }}>
        <Box sx={{ 
          minWidth: { 
            xs: '100%', 
            lg: '50%', 
          },
          display: {
            xs: registerChoice ? 'none' : 'flex',  
            lg: 'flex'                             
          }, 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '2rem',
          ...(registerChoice ? {
              transition: 'transform 1s ease-in-out , opacity 0.5s ease-in-out',
              transform: 'translateX(100%)',
              opacity: 0,
              zIndex: 0,
            }
            :
            {
              transition: 'transform 1s ease-in-out , opacity 1.6s ease-in',
              transform: 'translateX(0)',
              opacity: 1,
              zIndex: 1
            }
            )

          }}>
          {/* form login */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column-reverse', md: 'row'},
            justifyContent: 'center', 
            gap: '0.5rem' 
          }}>
            <Typography variant="h6" 
              sx={{ color: theme.palette.text.secondary, 
                fontSize: { xs: '22px', sm: '25px',  md:'28px'},  
                fontWeight: '400',
              }}>
              Welcome to 
              <span className="span-gradient-title"> DeepSearchAI</span>
            </Typography>
            <img style={{ width: '2rem', alignSelf: 'center', transform: 'translateY(-3px)'}} src={logo}/>
          </Box>
          <Box sx={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '30rem'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
            }}>
              
              <FormControl variant="outlined" sx={{ position: 'relative'}}>
                <TextField 
                  label="Email" 
                  variant="outlined"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && 
                  <span style={{
                    color: theme.palette.error.main ,
                    fontSize: '14px',
                    position: 'absolute',
                    left: 0,
                    bottom: '-20px'
                  }}>
                    {errors.email}
                  </span>
                }
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  type={ showPassword ? 'text' : 'password' }
                  value={ password }
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors.password && 
                  <span style={{
                    color: theme.palette.error.main ,
                    fontSize: '14px',
                    position: 'absolute',
                    left: 0,
                    bottom: '-20px'
                  }}>
                    {errors.password}
                  </span>
                }
              </FormControl>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: '0.7rem' 
            }}>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, cursor: 'pointer' }} onClick={()=> setModalOpen(true)}>
                Forgot your password?
              </Typography>
              <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary, cursor: 'pointer' }} onClick={handleToggle}>
                Create account
              </Typography>
            </Box>
          </Box>
          {/* Modal de Esqueci a Senha */}
          <ForgotPasswordModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={handleForgotPassword}
            loading={loading}
            setForgotEmail={setForgotEmail}
          />
          <Box>
          </Box>
          <Box sx={{
            width: '90%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '22rem'
          }}>
            <Button 
              variant="contained" 
              size="large" sx={{ background: theme.palette.gradients.text }} 
              onClick={handleLogin}
            >
              LOG IN
            </Button>
            <Typography sx={{alignSelf: 'center'}}>or</Typography>
            <Button 
              variant="outlined" 
              size="large" sx={{ border: theme.borders.primary }}
              onClick={() => setGoogleLoginAttempted(true)}
            >
                CONTINUE WITH GOOGLE
            </Button>
          </Box>
        </Box>

        
        {/* Container Image */}
        <Box sx={{
            zIndex: 30,
            position: 'absolute',
            top: 0,
            left: registerChoice ? 0 : '50%',
            width: '50%',
            height: '100%',
            boxSizing: 'border-box', 
            p: '1.5rem',
            display: { xs: 'none', lg: 'flex'},
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'column',
            transition: 'left 0.7s ease-in-out',
            overflow: 'hidden',
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}>
          <Typography variant="h4" 
            sx={{ 
              maxWidth: '15rem', 
              boxSizing: 'border-box',
              background: '#ffffffce', 
              p: '1.1rem', 
              borderRadius: '24px 8px 24px 8px', 
              color: theme.palette.text.secondary,
              fontWeight: '500',
              lineHeight: '2.6rem', 
              alignSelf: 'flex-end'
            }}>
            Unlock the Power of Information <span className="span-gradient-title">with AI-Driven Precision</span>
          </Typography>
          <Typography variant="body2" 
            sx={{ 
              width: "80%",
              boxSizing: 'border-box',
              background: '#ffffffce', 
              p: '1.1rem', 
              borderRadius: '24px 8px 24px 8px', 
              color: theme.palette.text.secondary,
              fontWeight: '600',
              alignSelf: 'start'
            }}>
              {/* <span className="span-gradient-body"></span> */}
              This innovative web application leverages AI to streamline your information searches.
              With a sleek interface, it processes queries and <span className="span-gradient-body">delivers accurate results</span>, 
              complete with reliable web references. 
              Experience the power of intelligent data exploration and <span className="span-gradient-body">effortlessly uncover valuable insights</span>.
          </Typography>
        </Box>
            
        {/* Form register */}
        <Box sx={{ 
              minWidth: { 
                xs: '100%', 
                lg: '50%', 
              },
              display: {
                xs: !registerChoice ? 'none' : 'flex',  
                lg: 'flex'                             
              }, 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '2rem',
              ...(registerChoice ? 
                {
                  transition: 'transform 0.8s ease-in-out , opacity 1.6s ease-in',
                  transform: 'translateX(0)',
                  zIndex: 1,
                  opacity: 1
                }
                :
                {
                  transform: 'translateX(-100%)',
                  zIndex: 0,
                  opacity: 0,
                  transition: 'transform 1s ease-in-out , opacity 0.5s ease-in-out',
                }
              )
            }}
            >
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column-reverse', md: 'row'},
              justifyContent: 'center', 
              gap: '0.5rem' 
            }}>
              <Typography variant="h6" 
                sx={{ color: theme.palette.text.secondary, 
                  fontSize: { xs: '22px', sm: '25px',  md:'28px'}, 
                  fontWeight: '400',
                }}>
                Welcome to 
                <span className="span-gradient-title"> DeepSearchAI</span>
              </Typography>
                <img style={{ width: '2rem', alignSelf: 'center', transform: 'translateY(-3px)'}} src={logo}/>
              </Box>
              <Box sx={{
                width: '90%',
                maxWidth: '30rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}>
                  <FormControl variant="outlined">
                    <TextField 
                      label="Email" 
                      variant="outlined"
                      value={registerEmail} 
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      sx={{position: 'relative'}}
                    />                   
                    {registerErrors.registerEmail && 
                          <span style={{
                            color: theme.palette.error.main ,
                            fontSize: '14px', 
                            position: 'absolute',
                            left: 0,
                            bottom: '-20px' 
                          }}>
                            {registerErrors.registerEmail}
                          </span>
                      } 
                  </FormControl>
                  <FormControl variant="outlined" sx={{ position: 'relative'}}>
                    <InputLabel>Password</InputLabel>
                    <OutlinedInput
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowRegisterPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                      {registerErrors.registerPassword && 
                        <span style={{
                          color: theme.palette.error.main ,
                          fontSize: '14px',
                          position: 'absolute',
                          left: 0,
                          bottom: '-20px'
                        }}>
                          {registerErrors.registerPassword}
                        </span>
                      }
                  </FormControl>
                  <FormControl variant="outlined" sx={{position: 'relative'}}>
                    <InputLabel>Confirm Password</InputLabel>
                    <OutlinedInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={handleRegisterKeyPress}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    {registerErrors.confirmPassword && 
                        <span style={{
                          color: theme.palette.error.main ,
                          fontSize: '14px',
                          position: 'absolute',
                          left: 0,
                          bottom: '-20px'
                        }}>
                          {registerErrors.confirmPassword}
                        </span>
                      }
                  </FormControl>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: '30rem',
                  pt: '0.6rem'
                }}>
                  <Typography variant="subtitle2"  sx={{ cursor: 'pointer' }}>
                    <FormControlLabel 
                      control={
                        <Switch
                          size={'medium'} 
                          onChange={handleSwitchChange}
                          checked={emailNotification}
                        />
                      } 
                      label="E-mail notification" 
                      labelPlacement="start" 
                      sx={{ 
                        margin: 0,
                    
                      }}
                      slotProps ={{
                        typography: {
                          sx: {
                            fontSize: '14px', 
                            color: '#303030', 
                          },
                      }}}
                    />
                  </Typography>
                </Box>
                <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Already has account?
                  <Button 
                  onClick={handleToggle}
                  variant="text" 
                  size="small" 
                  className="text-gradient" 
                  sx={{ fontWeight: 600, fontSize: '14px' }}>
                    LOG IN
                  </Button>
                </Typography>
              </Box>
              <Box sx={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxWidth: '22rem'
              }}>
                <Button 
                  onClick={handleRegister}
                  variant="contained" 
                  size="large" 
                  sx={{ background: theme.palette.gradients.text, mt: '1rem' }}
                >
                  SIGN UP
                </Button>
              </Box>
            </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
