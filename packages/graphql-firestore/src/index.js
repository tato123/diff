const path = require('path');

// Activate Google Cloud Trace and Debug when in production
if (process.env.NODE_ENV === 'production') {
  /* eslint-disable global-require */
  require('@google-cloud/trace-agent').start();
  require('@google-cloud/debug-agent').start();
}

require('./dotenv');
require('./server');