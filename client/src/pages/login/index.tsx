import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Paper, TextField, Typography, Button, Switch, FormControlLabel, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useState } from "react";

const LoginPage = () => {
  const [registerChoice, setRegisterChoice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const theme = useTheme();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleToggle = () => {
    setRegisterChoice(!registerChoice);
  };

  const handleLogin = async () => {

  }

  return (
    <Box sx={{
      width: '100%',
      px: '2rem',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff'
    }}>
      <Paper elevation={2} sx={{
        width: '90%',
        height: '90%',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
        border: theme.borders.secondary,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: registerChoice ? '50%' : 0,
          width: '50%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.8s ease-in-out',
        }}>
          {registerChoice ? (
            <Box sx={{ 
              width: '70%',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '2rem',
            }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontSize: '28px', fontWeight: '400' }}>
                Welcome to 
                <Box component="span" className="text-gradient" sx={{ 
                  fontSize: '32px', 
                  fontWeight: '600', 
                  color: 'pink', 
                  paddingLeft: 1, 
                  paddingRight: 1,
                }}>
                  DeepSearchAI
                </Box>
                  <img style={{ transform: 'translateY(3px)'}} src="./src/assets/icons/logo.svg"/>
              </Typography>
              <Box sx={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}>
                  <TextField label="Email" variant="outlined" />
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
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
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showConfirmPassword ? 'text' : 'password'}
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
                  </FormControl>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  paddingRight: 1, 
                  paddingLeft: 1
                }}>
                  <Typography sx={{ cursor: 'pointer' }}>
                    <FormControlLabel control={<Switch defaultChecked />} label="Allow notification" labelPlacement="start" sx={{ margin: 0 }} />
                  </Typography>
                  <Typography sx={{ cursor: 'pointer' }}>
                  Privacy Police
                  </Typography>
                </Box>
                <Typography sx={{ paddingLeft: 1 }}>Already has account?
                  <Button 
                  onClick={handleToggle}
                  variant="text" 
                  size="small" 
                  className="text-gradient" 
                  sx={{ fontWeight: 600, fontSize: '16px' }}>
                    LOG IN
                  </Button>
                </Typography>
              </Box>
              <Box sx={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Button variant="contained" size="large" sx={{ background: theme.palette.gradients.text }}>SIGN UP</Button>
                <Typography sx={{alignSelf: 'center'}}>or</Typography>
                <Button variant="outlined" size="large" sx={{ border: theme.borders.primary }}>SIGN UP WITH GOOGLE</Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              width: '70%',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '2rem',
            }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontSize: '28px', fontWeight: '400' }}>
                Welcome to 
                <Box component="span" className="text-gradient" sx={{ 
                  fontSize: '32px', 
                  fontWeight: '600', 
                  color: 'pink', 
                  paddingLeft: 1, 
                  paddingRight: 1,
                }}>
                  DeepSearchAI
                </Box>
                  <img style={{ transform: 'translateY(3px)'}} src="./src/assets/icons/logo.svg"/>
              </Typography>
              <Box sx={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}>
                  
                  <FormControl variant="outlined">
                    <TextField label="Email" variant="outlined" />
                  </FormControl>
                  <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
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
                  </FormControl>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  paddingRight: 1, 
                  paddingLeft: 1
                }}>
                  <Typography sx={{ cursor: 'pointer' }}>
                    Forgot your password?
                  </Typography>
                  <Typography sx={{ cursor: 'pointer' }} onClick={handleToggle}>
                  Create account
                  </Typography>
                </Box>
              </Box>
              <Box>
              </Box>
              <Box sx={{
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <Button variant="contained" size="large" sx={{ background: theme.palette.gradients.text }} onClick={handleLogin}>LOG IN</Button>
                <Typography sx={{alignSelf: 'center'}}>or</Typography>
                <Button variant="outlined" size="large" sx={{ border: theme.borders.primary }}>CONTINUE WITH GOOGLE</Button>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{
          zIndex: 10,
          position: 'absolute',
          top: 0,
          left: registerChoice ? 0 : '50%',
          width: '50%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.8s ease-in-out',
          overflow: 'hidden',
          backgroundImage: 'url(./src/assets/icons/banner.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
