"use client";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid2,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { useState } from "react";

const SignUp = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    });
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const isValidate = () => {
    let isValid = true;
    let tempErrors = {};
    if (!data.firstName) {
      tempErrors.firstName = "Firstname is required";
      isValid = false;
    }
    if (!data.lastName) {
      tempErrors.lastName = "Lastname is required";
      isValid = false;
    }
    if (!data.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      tempErrors.email = "Email is not valid";
      isValid = false;
    }
    if (!data.username) {
      tempErrors.username = "Username is required";
    }
    if (!data.password) {
      tempErrors.password = "Password";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValidate()) {
      const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.username,
        password: data.password,
      };

      try {
        const response = await fetch("http://localhost:3001/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
          setData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
          });
          alert("Welcome to LeafNotes");
          router.push("/profile");
        } else {
          alert(result.error || "Something went wrong, please try again.");
        }
      } catch (error) {
        console.error("Error registering user:", error);
        alert("Network error, please try again later.");
      }
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: "#B0E0E6",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          display: "flex",
          background: "#F0D2D6",
          borderRadius: "10px",
          top: "50%",
          position: "absolute",
          transform: "translate(0,-50%)",
          right: "5%",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "jacques Francois",
              marginBottom: 2,
              color: "#3C3C3C",
              fontWeight: "500",
              whiteSpace: "pre-line",
              letterSpacing: "0.5px",
              lineHeight: 1.5,
              padding: "10px 20px",
              backgroundColor: "#F5ECE8",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ fontWeight: "bold", fontStyle: "italic" }}>
              Welcome to LeafNotes {"\n"}
            </Box>
            Track what you've read and {"\n"}what's next.
          </Typography>

          <Box sx={{ width: "500px", height: "auto" }}>
            <img src="./books.png" style={{ width: "100%", height: "auto" }} />
          </Box>
        </Container>
        <Container
          maxWidth="md"
          sx={{
            padding: 3,
            background: "#EAD3C4",
            borderRadius: "10px",
            marginRight: "-25px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              margin: "15px",
              fontFamily: "jacques Francois",
            }}
          >
            Create Account{" "}
          </Typography>{" "}
          <Box sx={{ display: "flex", width: "100%", mb: 1 }}>
            {" "}
            <Grid2 container spacing={2} sx={{ width: "100%" }}>
              {" "}
              <Grid2 xs={6} sx={{ flexGrow: 1, maxWidth: "50%" }}>
                {" "}
                <TextField
                  variant="outlined"
                  required
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="fname"
                  fullWidth
                  value={data.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  helperText={errors.firstName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />{" "}
              </Grid2>{" "}
              <Grid2 xs={6} sx={{ flexGrow: 1, maxWidth: "50%" }}>
                {" "}
                <TextField
                  variant="outlined"
                  required
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  fullWidth
                  value={data.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />{" "}
              </Grid2>{" "}
            </Grid2>{" "}
          </Box>{" "}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={data.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />{" "}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={data.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />{" "}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={data.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />{" "}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              background: "grey",
              borderRadius: 2,
              mt: 3,
              mb: 2,
              fontFamily: "jacques Francois",
              textTransform: "none",
              fontSize: "20px",
            }}
            onClick={handleSubmit}
          >
            Submit{" "}
          </Button>{" "}
          <Typography variant="h8">
            Already have an account?{" "}
            <a href="/login" target="_blank" style={{ color: "blueviolet" }}>
              Login{" "}
            </a>{" "}
          </Typography>{" "}
        </Container>{" "}
      </Container>
    </Container>
  );
};

export default SignUp;