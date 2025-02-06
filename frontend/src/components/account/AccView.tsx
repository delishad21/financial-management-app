import { Avatar, Box, Stack, Typography, Divider } from "@mui/material";

export const AccView: React.FC<{ username: string; email: string }> = ({
  username,
  email,
}) => (
  <Box
    p={4}
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 4,
      boxShadow: 2,
      textAlign: "center",
      margin: "0 auto",
    }}
  >
    <Stack spacing={2} direction="column" alignItems="center">
      {/* Profile Image */}
      <Avatar
        className="w-24 h-24"
        sx={{ width: 96, height: 96 }}
        alt="User Profile"
      />
      {/* Username */}
      <Typography variant="h5" fontWeight="bold">
        {username}
      </Typography>
      <Divider sx={{ width: "100%", my: 2 }} />
      {/* Email */}
      <Typography variant="body1" color="text.secondary">
        Email: {email}
      </Typography>
    </Stack>
  </Box>
);
