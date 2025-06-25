import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const year = searchParams.get('year');

  if (!username || !year) {
    return NextResponse.json(
      { error: 'Username and year are required' },
      { status: 400 }
    );
  }

  try {
    // GitHub's GraphQL API endpoint
    const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';
    
    // GraphQL query to fetch contribution data
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username,
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`
    };

    // Note: GitHub GraphQL API requires authentication
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You'll need to add a GitHub token here
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json({
      username,
      year: parseInt(year),
      contributions: data.data.user.contributionsCollection.contributionCalendar
    });

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub contributions' },
      { status: 500 }
    );
  }
}

// Alternative implementation using web scraping if you don't want to use GitHub API token
/*
export async function GET_SCRAPING(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const year = searchParams.get('year');

  if (!username || !year) {
    return NextResponse.json(
      { error: 'Username and year are required' },
      { status: 400 }
    );
  }

  try {
    // Fetch the user's GitHub profile page
    const response = await fetch(`https://github.com/${username}?from=${year}-01-01&to=${year}-12-31&type=all`);
    
    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }

    const html = await response.text();
    
    // Extract contribution data from the HTML
    // This regex looks for the contribution data in the page
    const contributionRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"/g;
    const contributions = [];
    let match;

    while ((match = contributionRegex.exec(html)) !== null) {
      contributions.push({
        date: match[1],
        level: parseInt(match[2]),
        count: match[2] === '0' ? 0 : undefined // GitHub doesn't expose exact counts via HTML
      });
    }

    // Group by weeks (GitHub's contribution graph is organized by weeks)
    const weeks = [];
    let currentWeek = [];
    
    contributions.forEach((contribution, index) => {
      currentWeek.push(contribution);
      
      // Start new week every 7 days or at the end
      if ((index + 1) % 7 === 0 || index === contributions.length - 1) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }
    });

    return NextResponse.json({
      username,
      year: parseInt(year),
      contributions: {
        weeks,
        totalContributions: contributions.filter(c => c.level > 0).length
      }
    });

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub contributions' },
      { status: 500 }
    );
  }
}
*/