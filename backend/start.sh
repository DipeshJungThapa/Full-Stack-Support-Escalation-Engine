#!/bin/bash

# Start the worker in the background
celery -A config worker --loglevel=info &

# Start the web server in the foreground
gunicorn config.wsgi
