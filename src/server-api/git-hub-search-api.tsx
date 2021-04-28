import { GitHubRepositoryDTO } from './git-hub-repository-dto';
import axios from 'axios';


export class GitHubSearchAPI {
    private static gitHubTrendingReposUrl: string = 'https://api.github.com/search/repositories?q=created:%3E2021-04-19&sort=stars&order=desc';

    public static async getLastWeekTrendingRepos(): Promise<GitHubRepositoryDTO> {
        const { data } = await axios.get(this.gitHubTrendingReposUrl, {
            method: 'GET',
            headers: {
                authorization: 'token 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',
            },
        });
        return data;
    }
}
