import LeftImage from "../images/main_left.svg";

const Intro = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 mt-20">
      <div className="">
        <img src={LeftImage} />
      </div>

      <div className="text-2xl mt-20">
        <div className="float-right">
          <div className="my-4 text-purple-800">
            <span className="font-semibold text-6xl">4</span>&nbsp;
            <span className="font-semibold text-5xl">Easy Steps...</span>
          </div>

          <div>
            <div>
              <span className="font-bold pr-2">1.</span>Give your app a name and
              a logo
            </div>
            <div>
              <span className="font-bold pr-2">2.</span>Upload audio and video
              content
            </div>
            <div>
              <span className="font-bold pr-2">3.</span>Oragnise content into
              playlists
            </div>
            <div>
              <span className="font-bold pr-2">4.</span>Click the Generate App
              button
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
