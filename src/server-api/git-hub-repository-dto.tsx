export interface GitHubRepositoryDTO {
    items: Array<{
        id: number;
        name: string;
        html_url: string;
        description: string;
        stargazers_count: number;
        language: string;
        owner: {
            login: string;
        }
    }>
}
