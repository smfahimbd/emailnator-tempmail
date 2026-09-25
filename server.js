const express = require('express');
const path = require('path');
const { generateEmail } = require('./email/generateEmail');
const { getMessageList } = require('./email/messageList');
const { getMessageView } = require('./email/messageView');

class EmailnatorServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.config = {};

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    this.app.use(express.json());

    this.app.use(express.static('public', {
      maxAge: '1d',
      etag: true
    }));

    this.app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      next();
    });

    this.app.use((req, res, next) => {
      const start = Date.now();

      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
          `${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
        );
      });

      next();
    });
  }

  initializeRoutes() {
    this.app.get('/', this.serveStaticFile('index.html'));
    this.app.get('/inbox/:email', this.serveStaticFile('inbox.html'));
    this.app.get(
      '/inbox/:email/:messageID',
      this.serveStaticFile('message.html')
    );

    this.app.post(
      '/api/generate-email',
      this.handleGenerateEmail.bind(this)
    );

    this.app.get(
      '/api/message-list/:email',
      this.handleGetMessageList.bind(this)
    );

    this.app.get(
      '/api/message-view/:email/:messageID',
      this.handleGetMessageView.bind(this)
    );
  }

  initializeErrorHandling() {
    this.app.use((err, req, res, next) => {
      console.error('Unhandled error:', err);

      if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON in request body'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });

    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    });
  }

  serveStaticFile(filename) {
    return (req, res) => {
      res.sendFile(path.join(__dirname, 'public', filename));
    };
  }

  async retryWithBackoff(fn, options = {}) {
    return await fn();
  }

  successResponse(data, meta = {}) {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...meta
    };
  }

  errorResponse(error, statusCode = 500) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      statusCode,
      timestamp: new Date().toISOString()
    };
  }

  async handleGenerateEmail(req, res) {
    try {
      const { emailType } = req.body;

      if (!emailType) {
        return res.status(400).json(
          this.errorResponse(
            new Error('emailType is required'),
            400
          )
        );
      }

      const emailData = await this.retryWithBackoff(
        () => generateEmail(emailType)
      );

      res.json(this.successResponse(emailData));
    } catch (error) {
      this.handleApiError(error, res);
    }
  }

  async handleGetMessageList(req, res) {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json(
          this.errorResponse(
            new Error('Email parameter is required'),
            400
          )
        );
      }

      const messageList = await this.retryWithBackoff(
        () => getMessageList(email)
      );

      res.json(
        this.successResponse(messageList)
      );
    } catch (error) {
      this.handleApiError(error, res);
    }
  }

  async handleGetMessageView(req, res) {
    try {
      const { email, messageID } = req.params;

      if (!email || !messageID) {
        return res.status(400).json(
          this.errorResponse(
            new Error('Email and messageID parameters are required'),
            400
          )
        );
      }

      const messageView = await this.retryWithBackoff(
        () => getMessageView(email, messageID)
      );

      res.json(
        this.successResponse(messageView)
      );
    } catch (error) {
      this.handleApiError(error, res);
    }
  }

  handleApiError(error, res) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    if (error.response?.status === 503) {
      return res.status(503).json(
        this.errorResponse(
          new Error(
            'Emailnator service is temporarily unavailable. Please try again later.'
          ),
          503
        )
      );
    }

    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ETIMEDOUT'
    ) {
      return res.status(503).json(
        this.errorResponse(
          new Error(
            'Unable to connect to email service. Please check your connection.'
          ),
          503
        )
      );
    }

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json(
      this.errorResponse(error, statusCode)
    );
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      const port = String(this.port);

      const lines = [
        `║  📍 Port: ${port}`,
        '║  🌐 Environment: Development'
      ];

      console.log(`
╔══════════════════════════════════╗
║  🚀 Emailnator Server Started    ║
╠══════════════════════════════════╣
${lines.map(line => `${line.padEnd(35)}║`).join('\n')}
╚══════════════════════════════════╝

📡 Server running at http://localhost:${port}
  `);
    });

    this.server.on('error', error => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${this.port} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
    });

    return this.server;
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('🛑 Server stopped');
      });
    }
  }
}

const server = new EmailnatorServer();
server.start();
