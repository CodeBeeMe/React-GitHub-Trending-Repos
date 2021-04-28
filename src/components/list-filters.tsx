import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import { Typography } from '@material-ui/core';
import { ControlledCheckbox } from './checkbox';
import { bodyWidth } from '../index';
import { AlertBanner } from './alert-banner';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            backgroundColor: '#f5faff',
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '5px 27px',
            borderRadius: bodyWidth > 768 ? '0.6rem 0.6rem 0 0' : 0,
            boxShadow: '5px 5px 5px rgba(0,0,0,.1)',
            overflow: 'auto',
            color: '#',
            '& > * > i': {
                fontSize: 25,
            },
        },
        badge: {
            color: '#f6f8fa',
            '& > *': {
                backgroundColor: '#ff630f',
            },
        },
        container: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        button: {
            display: 'block',
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            '& > *': {
                fontSize: 12,
            },
        },
        select: {
            width: 125,
        },
    }),
);

type ListFiltersProps = {
    favorites: Array<number>,
    languages: Array<string>,
    repoCount: number,
    resetRepos(): void,
    filterByStarred(): void,
    filterByLanguage(language: string): void,
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
    const classes = useStyles();
    const [language, setLanguage] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const { favorites, languages, repoCount, resetRepos, filterByStarred, filterByLanguage } = props;

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        event.target.value ? filterByLanguage(event.target.value as string) : resetRepos();
        setLanguage(event.target.value as string);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleOpenAlert = (open: boolean) => {
        setOpenAlert(open);
    }

    return (
        <>
            <AlertBanner
                openAlert={openAlert}
                handleOpenAlert={handleOpenAlert}/>
            <Paper className={classes.paper} variant={'outlined'}>
                <Typography variant="h6" component="h6"
                            style={{ color: '#555', padding: '10px 0', marginRight: '15px' }}>
                    <i className="fab fa-github"/> GitHub's Trending Repositories&nbsp;
                    <Badge className={classes.badge} badgeContent={repoCount} color="primary">
                        <CollectionsBookmarkIcon/>
                    </Badge>
                </Typography>

                <div className={classes.container}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="controlled-open-select-label" style={{color: '#0fa7ff'}}>Filter by Language</InputLabel>
                        <Select
                            className={classes.select}
                            labelId="controlled-open-select-label"
                            id="controlled-open-select"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={language}
                            onChange={handleChange}
                        >
                            <MenuItem value="" dense>
                                <em>None</em>
                            </MenuItem>
                            {languages.map((language: string) => (
                                    <MenuItem key={language} value={language} dense>
                                        {language}
                                    </MenuItem>
                                ),
                            )}
                        </Select>
                    </FormControl>

                    <ControlledCheckbox
                        label={'Favorites'}
                        favorites={favorites}
                        filterByStarred={filterByStarred}
                        resetRepos={resetRepos}
                        handleOpenAlert={handleOpenAlert}
                    />
                </div>
            </Paper>
        </>
    );
};
