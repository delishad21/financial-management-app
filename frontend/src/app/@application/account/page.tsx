"use client";

import { AccModificationView } from "@/components/account/AccModificationView";
import { AccNavBar } from "@/components/account/AccNavBar";
import { AccView } from "@/components/account/AccView";
import PageContainer from "@/components/container/PageContainer";
import DashboardCard from "@/components/shared/DashboardCard";
import { Box, Divider, Grid } from "@mui/material";
import React from "react";

const AccountPage = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  // TODO: Replace with actual user data
  const username = "John Doe";
  const email = "johndoe@gmail.com";

  return (
    <PageContainer title="My Account" description="Manage account details">
      <DashboardCard title="My Account">
        <Grid container spacing={1} wrap="nowrap">
          {/* Left: Navigation */}
          <Grid item xs={1.9}>
            <AccNavBar activeTab={activeTab} onTabChange={setActiveTab} />
          </Grid>
          <Grid item xs={0.1}>
            <Divider orientation="vertical" />
          </Grid>
          {/* Right: Content */}
          <Grid item xs={10}>
            <Box pl={2}>
              {activeTab === 0 ? (
                <AccView username={username} email={email} />
              ) : (
                <AccModificationView username={username} email={email} />
              )}
            </Box>
          </Grid>
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default AccountPage;
