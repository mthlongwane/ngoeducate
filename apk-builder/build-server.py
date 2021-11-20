import os
from flask import Flask, flash, request, redirect, url_for, send_file
from werkzeug.utils import secure_filename
import uuid
import tarfile
import subprocess
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)-8s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)


UPLOAD_FOLDER = './uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def run_process(cmd, **kwargs):
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT, **kwargs)
    while(True):
        retcode = p.poll()
        line = p.stdout.readline()
        yield line
        if retcode is not None:
            break

def build(path):
    logging.info("Installing node modules")
    for line in run_process(["yarn"], cwd=path):
        print(line)
    logging.info("Running ./gradlew assembleRelease")
    env=dict(os.environ, ANDROID_SDK_ROOT="/opt/android")
    cwd=os.path.join(path, "android")
    for line in run_process(["./gradlew", "assembleRelease"], cwd=cwd, env=env):
        print(line)


    return True


@ app.route('/', methods=['POST'])
def upload_file():

    logging.info("Processing incoming request...")
    if request.method == 'POST':

        if 'file' not in request.files:
            return 'no file set'
        file = request.files['file']

        if file:
            path = os.path.join(
                app.config['UPLOAD_FOLDER'], str(uuid.uuid4()))
            os.mkdir(path)
            filename = secure_filename(file.filename)
            filepath = os.path.join(path, filename)
            file.save(filepath)

            tar = tarfile.open(filepath)
            tar.extractall(path)
            tar.close()

        else:
            logging.error("Invalid file!")
            return 'invalid file!'

        logging.info("File uploaded successfully!")
       
       
        build(path)
        logging.info("Build done.")

        return send_file(os.path.join(path, "android", "app", "build", "outputs", "apk", "release", "app-release.apk"))
