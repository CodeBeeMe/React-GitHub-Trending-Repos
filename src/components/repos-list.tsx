import React, { Fragment, useEffect, useState } from 'react';
import { GitHubSearchAPI } from '../server-api/git-hub-search-api';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Typography } from '@material-ui/core';
import uniq from 'lodash/uniq';
import { ListFilters } from './list-filters';
import { bodyWidth } from '../index';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: bodyWidth > 768 ? 50 : 0,
        },
        paper: {
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 980,
            maxHeight: 700,
            padding: 10,
            borderRadius: bodyWidth > 768 ? ' 0 0 0.6rem 0.6rem' : 0,
            boxShadow: '5px 5px 5px rgba(0,0,0,.1)',
            overflow: 'auto',
            color: '#0fa7ff',
        },
        listItem: {
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        listItemIcon: {
            color: '#828c96',
            minWidth: 35,
            '& > *': {
                fontSize: 25,
            },
        },
        listItemText: {
            maxWidth: bodyWidth > 768 ? 850 : 200,
        },
        listItemTextStar: {
            position: 'absolute',
            right: 20,
            color: '#ff630f',
            '& > i': {
                fontSize: 25,
            },
        },
        details: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: '5px 10px 0 0',
            '& > *': {
                background: '#828c96 ',
                borderRadius: '1rem',
                padding: '2px 5px',
                fontSize: 11,
                color: '#f8f8f8',
            },
            '& > i': {
                fontSize: 14,
            },
        },
    }),
);

type GitHubRepository = {
    id: number;
    name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    language: string;
    owner: {
        login: string;
    }
}

export const GitHubTrendingList = () => {
    const classes = useStyles();
    const [status, setStatus] = useState(200);
    const [repos, setRepos] = useState<Array<GitHubRepository>>([]);
    const [baseRepos, setBaseRepos] = useState<Array<GitHubRepository>>([]);
    const [favorites, setFavorites] = useState<Array<number>>([]);
    const [languages, setLanguages] = useState<Array<string>>([]);

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('favorites') as string);
        if (localData) {
            setFavorites(localData);
        }
    }, []);

    useEffect(() => {
        const json = JSON.stringify(favorites);
        localStorage.setItem('favorites', json);

    }, [favorites]);

    useEffect(() => {
        const getRepos = async () => {
            await GitHubSearchAPI.getLastWeekTrendingRepos()
                .then(function (response) {
                    const repos = response.items;
                    setRepos(repos);
                    setBaseRepos(repos);
                })
                .catch(function (error) {
                    if (error.response) {
                        setStatus(error.response.status);
                    }
                });
        };

        getRepos();
    }, []);

    useEffect(() => {
        const getReposLanguages = () => {
            let languages: Array<string> = [];
            repos.forEach((repo) => {
                repo.language ? languages.push(repo.language) : languages.push('Unknown language');
            });
            const uniqLanguages = uniq(languages.sort());
            setLanguages(uniqLanguages);
        };

        getReposLanguages();
    }, [repos]);

    const addToFavorites = (id: number) => () => {
        return !favorites.includes(id) ? setFavorites([...favorites, id]) : null;
    };

    const removeFromFavorite = (id: number) => () => {
        setFavorites(favorites.filter((favorite) => id !== favorite));
    };

    const filterByStarred = () => {
        let starredRepos: Array<any> = [];
        favorites.forEach((id: number) => {
            starredRepos.push(...repos.filter((repo) => repo.id === id));
        });
        if (starredRepos.length !== 0) {
            setRepos(starredRepos);
        }
    };

    const filterByLanguage = (language: string) => {
        let filteredByLanguage: Array<any> = [];
        if (language === 'Unknown language') {
            filteredByLanguage.push(...repos.filter((repo) => repo.language === null));
        } else {
            filteredByLanguage.push(...repos.filter((repo) => repo.language === language));
        }
        setRepos(filteredByLanguage);
    };

    const resetRepos = () => {
        setRepos(baseRepos);
    };

    return (
        <List component="ul" className={classes.root} aria-label="contacts">
            <ListFilters
                favorites={favorites}
                languages={languages}
                repoCount={repos.length}
                resetRepos={resetRepos}
                filterByStarred={filterByStarred}
                filterByLanguage={filterByLanguage}
            />

            {status !== 200 ? (
                <Paper className={classes.paper} variant={'outlined'}>
                    <Typography variant="subtitle1" component="p"
                                style={{ color: '#555', padding: '10px 0' }}>
                        <i className="fas fa-exclamation-circle"/> &nbsp;
                        API unavailable at the moment. Try again later.
                    </Typography>
                </Paper>) : repos.length ? (
                <Paper className={classes.paper} variant={'outlined'}>
                    {repos.map((repo) => (
                            <ListItem className={classes.listItem} key={repo.id} divider>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <i className="fas fa-file-code"/>
                                </ListItemIcon>

                                <ListItemText
                                    className={classes.listItemText}
                                    primary={
                                            <Link
                                                href={repo.html_url}
                                                title="View it on GitHub"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#0fa7ff' }}
                                            >
                                                {repo.owner.login}&nbsp; <i className="fas fa-chevron-right"/> &nbsp;
                                                <strong>{repo.name}</strong>&nbsp;&nbsp;
                                                <i style={{ color: '#c1c1c1' }} className="fas fa-external-link-alt"/>
                                            </Link>
                                    }
                                    secondary={
                                        <Fragment>
                                            {repo.description ? repo.description.substring(0, 120) : 'Description unavailable'}
                                            <span className={classes.details}>
                                                <span className={classes.details}>
                                                    <i className="far fa-star"/>
                                                    {repo.stargazers_count}&nbsp;
                                                </span>
                                                <span className={classes.details}>
                                                    <i className="fas fa-code"/>
                                                    {repo.language ?? 'Unknown language'}&nbsp;
                                                </span>
                                            </span>
                                        </Fragment>
                                    }
                                />

                                <ListItemText className={classes.listItemTextStar} primary={
                                    <Fragment>
                                        {favorites.includes(repo.id) ? (<Button
                                            variant="outlined"
                                            size="large"
                                            color="inherit"
                                            title="Un-star"
                                            onClick={removeFromFavorite(repo.id)}
                                        >
                                            <i className="fas fa-star"/>
                                        </Button>) : (
                                            <Button
                                                variant="outlined"
                                                size="large"
                                                color="inherit"
                                                title="Star"
                                                onClick={addToFavorites(repo.id)}
                                            >
                                                <i className="far fa-star"/>
                                            </Button>
                                        )}
                                    </Fragment>
                                }/>
                            </ListItem>
                        ),
                    )}
                </Paper>) : (
                <Paper className={classes.paper} variant={'outlined'}>
                    <Typography variant="subtitle1" component="p"
                                style={{ color: '#555', padding: '10px 0' }}>
                        <i className="fas fa-info-circle"/> Loading repositories
                    </Typography>&nbsp;&nbsp;
                    <CircularProgress color="inherit"/>
                </Paper>
            )}
        </List>
    );
};


