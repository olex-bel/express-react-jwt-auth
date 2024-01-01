
import { useState, useRef, useId, FormEvent } from "react"
import Avatar from "@mui/material/Avatar"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Form, useNavigate, Link as RouterLink } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useLoginMutation } from "../../features/auth/authApiSlice"
import { saveTokenToLocalStorage } from "../../utils/tokenHelper"
import { setToken } from "../../features/auth/authSlice"

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const emailRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const id = useId()

  const handleSubmit = async function (e: FormEvent) {
    e.preventDefault()

    const email = emailRef.current ? emailRef.current.value : ""
    const password = passwordRef.current ? passwordRef.current.value : ""

    if (!email || !password) {
      setErrorMessage("Please enter email and password.")
      return;
    }

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setToken({...data}))
      saveTokenToLocalStorage(data.token)
      navigate("/")
    } catch (err) {
      if (err && typeof err === "object" && "originalStatus" in err) {
        if (!err?.originalStatus) {
          setErrorMessage("Login Failed. No Server Response")
          return
        }
      }
      setErrorMessage("Oops! Login Failed. Check your username/password and retry.")
    }
  }

  return (
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Box component={Form} method="post" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            inputRef={emailRef}
            margin="normal"
            required
            fullWidth
            id={`${id}-email`}
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            inputRef={passwordRef}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id={`${id}-password`}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to='/register' variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
  );
}