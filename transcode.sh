#!/bin/bash -e

[ -z $1 ] && {
    echo "First argument must be filename to encode."
    exit 1
}

FILE="$1"
FILE_BASE="${FILE##*/}"
FILENAME="${FILE_BASE%%\.*}"
FILE_FLAC="flac/${FILENAME}.flac"

# Ensure absolute PATH for DockerCompose
# beeing able to mount it into the container
FIRST_CHAR="${FILE::1}"
[ "${FIRST_CHAR}" != '/' ] && FILE="$PWD/${FILE}"

[ ! -z $2 ] && {
    INITIAL="$2"
    echo "Applying initial forward of ${INITIAL}"
    INITIAL="-ss ${INITIAL}"
}

# - `--user ...`: Use same user as the running one, so generated FLAC have same owner
# - `--volume ...`: Mount passed filename into the container
# - `-t 00:01:00`: Force a maximum of 1 minute
# - `-ac 1`: Reduce to only one channel
# - `-c:a flac`: Encode to FLAC format
echo "Encode file to FLAC"
docker-compose run --rm \
    --user $(id -u):$(id -g) \
    --volume "${FILE}:/tmp/ffmpeg/podcasts/${FILE_BASE}:ro" \
    ffmpeg ${INITIAL} \
        -i "podcasts/${FILE_BASE}" \
        -t 00:01:00 \
        -ac 1 \
        -c:a flac \
        "${FILE_FLAC}"

echo "Get text from encoded FLAC file"
docker-compose run --rm podcast2text "/${FILE_FLAC}"
