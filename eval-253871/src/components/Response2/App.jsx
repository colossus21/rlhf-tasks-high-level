import React from 'react';
import { Grid, CardActionArea, CardContent, Typography, Box } from '@mui/material';

function ThreeColumnLayout() {
    const cardData = [
        // Replace this array with your actual data
        { id: 1, title: 'Card Title 1', image: <img src="https://picsum.photos/id/237/200/300" alt="Image 1" /> },
        { id: 2, title: 'Card Title 2', image: <img src="https://picsum.photos/id/238/200/300" alt="Image 2" /> },
        { id: 3, title: 'Card Title 3', image: <img src="https://picsum.photos/id/239/200/300" alt="Image 3" /> },
        // Add more data objects as needed
    ];

    return (
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {cardData.map((data) => (
                <Grid item xs={12} sm={4} md={4} key={data.id}>
                    <CardActionArea
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {data.title}
                            </Typography>
                        </CardContent>
                        <Box sx={{ height: "80px", width: "80px", mb: "10px" }}>
                            {data.image}
                        </Box>
                    </CardActionArea>
                </Grid>
            ))}
        </Grid>
    );
}

export default ThreeColumnLayout;
