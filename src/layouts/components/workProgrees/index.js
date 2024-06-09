// components/WorkInProgressCard.js
import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const CustomCard = styled(Card)({
  maxWidth: 345,
  margin: 'auto',
  marginTop: '20px',
});

const CustomCardMedia = styled(CardMedia)({
  height: 140,
});

const WorkInProgressCard = () => {
  return (
    <CustomCard>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#FFD93B" d="M62 57H2c-1.1 0-2-.9-2-2V35c0-1.1.9-2 2-2h60c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2z"/>
  <path fill="#F4C534" d="M32 39c-7.732 0-14 6.268-14 14h28c0-7.732-6.268-14-14-14z"/>
  <path fill="#E24B4B" d="M32 5c-8.284 0-15 6.716-15 15s6.716 15 15 15 15-6.716 15-15S40.284 5 32 5zm0 24c-4.963 0-9-4.037-9-9s4.037-9 9-9 9 4.037 9 9-4.037 9-9 9z"/>
</svg>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Work in Progress
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          This page is under construction. Please check back later.
        </Typography>
      </CardContent>
    </CustomCard>
  );
};

export default WorkInProgressCard;
