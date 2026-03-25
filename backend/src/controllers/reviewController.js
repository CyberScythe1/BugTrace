const db = require('../config/db');
const { analyzeSingle, analyzeBatch } = require('../services/aiService');
const { fetchRepoFiles, fetchFileContent } = require('../services/githubService');

async function analyze(req, res) {
  const { sourceType, codeContent, language, githubUrl } = req.body;
  const userId = req.user.id;

  try {
    let files = [];

    if (sourceType === 'paste') {
      if (!codeContent?.trim()) return res.status(400).json({ error: 'No code provided' });
      const result = await analyzeSingle(codeContent, language || 'javascript');
      files.push({ file_path: 'pasted_code', language: language || 'javascript', code_content: codeContent, ...result });

    } else if (sourceType === 'github') {
      if (!githubUrl?.trim()) return res.status(400).json({ error: 'No URL provided' });
      const urlParts = new URL(githubUrl).pathname.split('/').filter(Boolean);
      const [owner, repo] = urlParts;
      if (!owner || !repo) return res.status(400).json({ error: 'Invalid GitHub URL' });

      const repoFiles = await fetchRepoFiles(owner, repo);
      if (!repoFiles.length) return res.status(400).json({ error: 'No code files found in repo' });

      // Fetch all file contents in parallel
      const fileData = await Promise.all(repoFiles.map(async f => ({
        name: f.name,
        language: f.name.split('.').pop() || 'txt',
        content: await fetchFileContent(f.download_url)
      })));

      // Single batched AI call for ALL files
      const results = await analyzeBatch(fileData);

      files = results.map((r, i) => ({
        file_path: r.file_path || fileData[i].name,
        language: fileData[i].language,
        code_content: fileData[i].content,
        ...r
      }));
    } else {
      return res.status(400).json({ error: 'Invalid sourceType' });
    }

    const avgScore = parseFloat((files.reduce((s, f) => s + f.quality_score, 0) / files.length).toFixed(1));
    const repoName = sourceType === 'github' ? new URL(githubUrl).pathname.slice(1) : 'Pasted Code';

    const reviewRes = await db.query(
      'INSERT INTO reviews (user_id, source_type, source_url, repo_name, average_score) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [userId, sourceType, githubUrl || null, repoName, avgScore]
    );
    const reviewId = reviewRes.rows[0].id;

    for (const f of files) {
      await db.query(
        'INSERT INTO review_files (review_id, file_path, language, code_content, bug_report, improvements, quality_score, documentation) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [reviewId, f.file_path, f.language, f.code_content, JSON.stringify(f.bug_report), JSON.stringify(f.improvements), f.quality_score, f.documentation]
      );
    }

    res.json({ reviewId, data: files, averageScore: avgScore });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

async function getUserReviews(req, res) {
  try {
    const result = await db.query('SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getReviewById(req, res) {
  try {
    const review = await db.query('SELECT * FROM reviews WHERE id = $1', [req.params.id]);
    if (!review.rows.length) return res.status(404).json({ error: 'Not found' });
    const files = await db.query('SELECT * FROM review_files WHERE review_id = $1', [req.params.id]);
    res.json({ review: review.rows[0], files: files.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { analyze, getUserReviews, getReviewById };
