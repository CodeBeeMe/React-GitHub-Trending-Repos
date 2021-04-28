import { GitHubRepositoryDTO } from './git-hub-repository-dto';
import axios from 'axios';


export class GitHubSearchAPI {
    private static gitHubTrendingReposUrl: string = 'https://api.github.com/search/repositories?q=created:%3E2021-04-19&sort=stars&order=desc';

    public static async getLastWeekTrendingRepos(): Promise<GitHubRepositoryDTO> {
        const { data } = await axios.get(this.gitHubTrendingReposUrl, {
            method: 'GET',
            //Due to Githubs own API call rate limitation to 10 calls/hour an authorization token can be used to increase the call limit.
            //https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
            headers: {
                //Please add you own personal generated token below, replacing my old one and un-comment the authorization line if you want to make a token based call
                //if not, a normal call without token will be made with the 10 calls/hour limit.
                
                //authorization: 'token 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',
            },
        });
        return data;
    }
}
