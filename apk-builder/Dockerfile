FROM ubuntu:21.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install nodejs npm nginx unzip wget openjdk-8-jdk-headless -y

RUN apt-get install python3-pip -y

# install command line tools (Download the latest file from https://developer.android.com/studio#command-tools)
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-7302050_latest.zip -O /tmp/commandlinetools.zip \
 && unzip /tmp/commandlinetools.zip -d /opt/android \
 && mkdir /opt/android/cmdline-tools/latest \
 && cp /opt/android/cmdline-tools/bin/sdkmanager /opt/android/cmdline-tools/latest/ \
 && yes | /opt/android/cmdline-tools/latest/sdkmanager --sdk_root=/opt/android/ "platform-tools" "platforms;android-29"

WORKDIR /app
RUN mkdir ./uploads 
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN npm install -g yarn
COPY build-server.py .
EXPOSE 5000

ENV FLASK_APP build-server
CMD ["flask", "run", "--host", "0.0.0.0"]
