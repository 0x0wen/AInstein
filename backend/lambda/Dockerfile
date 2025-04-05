FROM manimcommunity/manim:latest

USER root

RUN apt-get update && apt-get install -y \
    sox \
    libsox-fmt-all \
    libpango1.0-dev \
    && apt-get clean
RUN pip install awslambdaric boto3
RUN pip install --upgrade "manim-voiceover[openai,transcribe]"

COPY app.py ./
RUN mkdir -p /tmp/media
RUN mkdir -p /tmp/.cache/fontconfig

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "app.lambda_handler" ]