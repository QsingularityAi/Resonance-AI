
######################################################################################################
#if you want to build this stuff locally without using the hw registry, run the docker-build.sh first.
######################################################################################################

FROM bitnami/python:3.10.15-debian-12-r15 AS xbase

# Install FFmpeg, crawler dependencies, and PDF processing tools
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    gettext \
    default-libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

RUN  pip install --upgrade pip

COPY requirements.txt .
RUN pip install -r requirements.txt
# Create a non-root user
RUN useradd -m appuser
USER appuser

FROM git.hw.ag:5050/ai/hw-chatbot/base:latest AS base
USER root
COPY requirements-new.txt .
RUN pip install -r requirements-new.txt
USER appuser

FROM xbase AS xrag
USER root
RUN apt-get update && \
    apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    poppler-utils \
    poppler-data \
    tesseract-ocr \
    libtesseract-dev \
    libmagic1 \
    ghostscript \
    python3-dev \
    build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


COPY requirements-rag.txt .
RUN pip install -r requirements-rag.txt

USER appuser
RUN cd /home/appuser && \
    wget https://github.com/opendatalab/MinerU/raw/master/scripts/download_models_hf.py -O download_models_hf.py && \
    python download_models_hf.py && \
    playwright install
#RUN crawl4ai-download-models

FROM git.hw.ag:5050/ai/hw-chatbot/rag:latest AS rag
USER root
COPY requirements-new.txt .
RUN pip install -r requirements-new.txt
COPY requirements-new-rag.txt .
RUN pip install -r requirements-new-rag.txt
USER appuser
RUN playwright install --with-deps chromium # just temporary while having newer crawl4ai in requirements-new-rag.txt

FROM xrag AS xgpu
USER root
RUN sed -i 's/main/main contrib non-free/g' /etc/apt/sources.list
RUN apt-get update
RUN apt-get install nvidia-driver-bin -y
RUN sed -i 's/"cpu"/"cuda"/' /home/appuser/magic-pdf.json
RUN python -m pip install paddlepaddle-gpu==3.0.0b1 -i https://www.paddlepaddle.org.cn/packages/stable/cu118/
USER appuser

FROM git.hw.ag:5050/ai/hw-chatbot/gpu:latest AS gpu
USER root
COPY requirements-new.txt .
RUN pip install -r requirements-new.txt
COPY requirements-new-rag.txt .
RUN pip install -r requirements-new-rag.txt
USER appuser

FROM bitnami/node:20.18.1-debian-12-r2 AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY frontend/ ./frontend/
RUN cd frontend/ && npm run build


FROM git.hw.ag:5050/ai/hw-chatbot/rag:latest AS prod
USER root

COPY requirements-new.txt .
RUN --mount=type=cache,target=/tmp/cache/pip \
    pip install -r requirements-new.txt  \
    --cache-dir=/tmp/cache/pip

COPY requirements-new-rag.txt .
RUN --mount=type=cache,target=/tmp/cache/pip \
    pip install -r requirements-new-rag.txt  \
    --cache-dir=/tmp/cache/pip

    # just temporary while having newer crawl4ai in requirements-new-rag.txt
RUN apt update && playwright install --with-deps chromium \
    && mv /root/.cache/ms-playwright /home/appuser/.cache/ms-playwright \
    && chown -R appuser /home/appuser/.cache/  \
    && ln -s /home/appuser/.cache/ms-playwright/chromium-1134/ /home/appuser/.cache/ms-playwright/chromium-1155 \
    && ln -s /home/appuser/.cache/ms-playwright/chromium-1134/ /home/appuser/.cache/ms-playwright/chromium-1161

# Install Gunicorn
RUN --mount=type=cache,target=/tmp/cache/pip  \
    pip install gunicorn \
    --cache-dir=/tmp/cache/pip

RUN mkdir -p /app/media /app/rag_cache && \
    chown -R appuser:appuser /app/media /app/rag_cache

USER appuser
# Copy the application code
COPY --chown=appuser:appuser . /app
COPY --chown=appuser:appuser --from=builder /app/dist ./dist
RUN django-admin compilemessages && python ./manage.py collectstatic --noinput

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PORT=8000

# Expose the port the app runs on
EXPOSE 8000

VOLUME ["/app/media"]
VOLUME ["/app/rag_cache"]

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
