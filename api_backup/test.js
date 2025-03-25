export default function handler(req, res) {
  res.status(200).json({
    success: true,
    message: 'API test endpoint is working',
    method: req.method,
    url: req.url,
    headers: {
      contentType: req.headers['content-type'],
      authorization: req.headers.authorization ? 'Present (redacted)' : 'Missing'
    },
    body: req.body ? 'Present (redacted)' : 'Missing',
    time: new Date().toISOString()
  });
}