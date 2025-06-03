
set -e

while ! pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "Waiting for database to start..."
  sleep 2
done

bin/task_manager_api eval "TaskManagerApi.Release.migrate"

exec "$@"