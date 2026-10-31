FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=80 \
    QINBOX_AUTH_DB=mysql

WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

EXPOSE 80
CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-80} --workers 1 --threads 8 --timeout 120"]
