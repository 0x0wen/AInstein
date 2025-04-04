FROM manimcommunity/manim:latest

RUN pip install awslambdaric boto3

COPY app.py ./
RUN mkdir -p /tmp/media

ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "app.lambda_handler" ]