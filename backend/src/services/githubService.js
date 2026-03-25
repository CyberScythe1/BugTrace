require('dotenv').config();

const GITHUB_HEADERS = {
  'User-Agent': 'BugTrace-App',
  'Accept': 'application/vnd.github.v3+json'
};

async function fetchRepoFiles(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/`;
  const res = await fetch(url, { headers: GITHUB_HEADERS });
  if (!res.ok) throw new Error(`GitHub API: ${res.status} ${res.statusText}`);
  const items = await res.json();
  
  const codeExts = /\.(js|jsx|ts|tsx|py|java|cpp|c|cs|go|rb|php|rs|swift|kt)$/i;
  return items
    .filter(f => f.type === 'file' && codeExts.test(f.name))
    .slice(0, 3);
}

async function fetchFileContent(downloadUrl) {
  const res = await fetch(downloadUrl);
  return res.text();
}

module.exports = { fetchRepoFiles, fetchFileContent };
