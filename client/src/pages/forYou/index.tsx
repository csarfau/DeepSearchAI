import React, { useEffect, useState } from 'react';
import { Container, Button, Grid2 as Grid, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { iconsPath } from '../components/Icons';
import { theme } from '../../App';
import { SuggestionThemes } from '../chat/partial/SuggestionCard';
import defaultImage from '@/assets/images/default-image.svg';

const ForYouPage = () => {
    const [data, setData] = useState<Array<Suggestion>>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/user/45015b5e-0862-4942-a823-17aa20514b99/pages/suggestions');

                if (res.ok) {
                    const { data } = await res.json();

                    setData(data)
                }

            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [])
    
    interface IPageCard {
        title: string;
        link: string;
        summary: string;
        imageUrl: string;
    }

    type Suggestion = {
        type: SuggestionThemes,
        pageData:Array<IPageCard>
    }

    const MediaCard: React.FC<IPageCard> = (props) => {
        return (
            <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={props.imageUrl || defaultImage}
                    title={props.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.summary}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button href={props.link} size="small">Go to Page</Button>
                </CardActions>
            </Card>
        );
    };

    const Section: React.FC<{ sectionData: Suggestion, sectionIndex: number }> = ({ sectionData }) => {
        const [currentPage, setCurrentPage] = useState(0);
        const cardsPerPage = 3;
        const totalPages = Math.ceil(sectionData.pageData.length / cardsPerPage);

        const handlePrevPage = () => {
            setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
        };

        const handleNextPage = () => {
            setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
        };

        const currentCards = sectionData.pageData.slice(
            currentPage * cardsPerPage,
            (currentPage + 1) * cardsPerPage
        );
        
        return (
            <Container sx={{ mb: 4, py: '2rem' }}>
                <Box sx={{display: 'flex', gap: '0.5rem', alignItems: 'center', mb: '1rem'}}>
                    <Box
                        sx={{
                            width: '1.2rem', 
                            height: '1.2rem', 
                            background: 'linear-gradient(147deg, rgba(151,0,209,1) 0%, rgba(157,0,200,1) 26%, rgba(222,0,105,1) 100%)',
                            WebkitMaskImage: `url(${iconsPath[sectionData.type]})`,
                            WebkitMaskSize: 'cover',
                            maskImage: `url(${iconsPath[sectionData.type]})`,
                            maskSize: 'cover',
                        }}
                        />
                    <Typography sx={{color: theme.palette.text.primary }} variant="h5">{sectionData.type}</Typography>
                </Box>
                <Grid container spacing={2} alignItems="stretch">
                    {currentCards.map((props, index) => (
                        <Grid key={index}>
                            <MediaCard
                                imageUrl={props.imageUrl || defaultImage}
                                title={props.title}
                                summary={props.summary}
                                link={props.link}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Grid container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                    <Grid>
                        <Button onClick={handlePrevPage} startIcon={<ArrowBackIcon />}>
                            Previous
                        </Button>
                    </Grid>
                    <Grid>
                        <Button onClick={handleNextPage} endIcon={<ArrowForwardIcon />}>
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        );
    };

    return (
        <Container>
            {data && 
                data.map((sectionData, index) => (
                    <Section key={index} sectionData={sectionData as Suggestion} sectionIndex={index} />
                ))
            }
        </Container>
    );
};

export default ForYouPage;