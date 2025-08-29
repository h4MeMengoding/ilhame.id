import axios from 'axios';

const GITHUB_API_ENDPOINT = 'https://api.github.com/graphql';
const USERNAME = 'h4MeMengoding'; // GitHub username

const GITHUB_CONTRIBUTIONS_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        colors
        totalContributions
        months {
          firstDay
          name
          totalWeeks
        }
        weeks {
          contributionDays {
            color
            contributionCount
            date
          }
          firstDay
        }
      }
    }
  }
}`;

export interface GitHubContribution {
  date: string;
  contributionCount: number;
  color: string;
}

export interface GitHubMonth {
  name: string;
  firstDay: string;
  totalWeeks: number;
}

export interface GitHubWeek {
  firstDay: string;
  contributionDays: GitHubContribution[];
}

export interface GitHubContributionCalendar {
  colors: string[];
  totalContributions: number;
  months: GitHubMonth[];
  weeks: GitHubWeek[];
}

export interface GitHubContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: GitHubContributionCalendar;
      };
    };
  };
}

/**
 * Fetch GitHub contributions data
 * @returns Promise<GitHubContributionCalendar | null>
 */
export async function fetchGitHubContributions(): Promise<GitHubContributionCalendar | null> {
  const token =
    process.env.GITHUB_TOKEN || process.env.GITHUB_READ_USER_TOKEN_PERSONAL;

  if (!token) {
    console.warn('GitHub token not configured for contributions');
    return null;
  }

  try {
    const response = await axios.post<GitHubContributionsResponse>(
      GITHUB_API_ENDPOINT,
      {
        query: GITHUB_CONTRIBUTIONS_QUERY,
        variables: {
          username: USERNAME,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      },
    );

    if (response.status !== 200) {
      console.error('GitHub API error:', response.status, response.statusText);
      return null;
    }

    const data = response.data;

    // Check if the response has the expected structure
    if (!data?.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error('Invalid GitHub API response structure');
      console.error(
        'Expected: data.data.user.contributionsCollection.contributionCalendar',
      );
      console.error('Received keys:', Object.keys(data));
      return null;
    }
    return data.data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return null;
  }
}
