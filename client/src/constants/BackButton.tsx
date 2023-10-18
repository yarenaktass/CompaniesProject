import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

export default function BackButton() {
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1); 
  };

  return (
    <Button onClick={handleBackButton}>
      <ArrowBackIcon style={{ color: 'white' }} />
    </Button>
  );
}


//useNavigate hook u tarayıcı geçmişindeki bir önceki sayfaya geçişi sağlar 
